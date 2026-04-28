package com.webguardx.ssl;

import com.webguardx.ssl.model.CertInfo;
import com.webguardx.ssl.model.CipherSuite;
import com.webguardx.ssl.model.HstsInfo;
import com.webguardx.ssl.model.SslScanResult;
import com.webguardx.ssl.util.CertParser;
import com.webguardx.ssl.util.CipherGrader;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.Record;
import org.xbill.DNS.Type;

import javax.net.ssl.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Service to perform Deep SSL/TLS analysis.
 *
 * Key design decisions:
 *  1. Two-phase handshake: strict first (detect validity), trust-all second (extract chain/ciphers
 *     even from misconfigured servers like college sites with incomplete chains).
 *  2. Cipher probing covers TLS 1.2 AND TLS 1.3; the server-selected cipher from the actual
 *     handshake is always included regardless of probing outcome.
 *  3. Grading is TLS-1.3-aware: if the server negotiates TLS 1.3, CBC fallback ciphers do NOT
 *     downgrade the grade — they exist only for compatibility.
 *  4. CT log check is non-blocking; null return means "unavailable", not "failed".
 */
@Service
public class SslAnalyzerService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SslAnalyzerService.class);

    private final WebClient.Builder webClientBuilder;
    private final SslScanRepository sslScanRepository;

    public SslAnalyzerService(WebClient.Builder webClientBuilder, SslScanRepository sslScanRepository) {
        this.webClientBuilder = webClientBuilder;
        this.sslScanRepository = sslScanRepository;
    }

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

    // ─── Trust-all SSLContext ─────────────────────────────────────────────────
    // Used ONLY for analysis (cert extraction from misconfigured servers).
    // Never used to validate / trust actual connections.

    private static final SSLContext TRUST_ALL_CTX = buildTrustAllContext();

    private static SSLContext buildTrustAllContext() {
        try {
            TrustManager[] trustAll = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                    public void checkClientTrusted(X509Certificate[] c, String t) {}
                    public void checkServerTrusted(X509Certificate[] c, String t) {}
                }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAll, new SecureRandom());
            return sc;
        } catch (Exception e) {
            throw new RuntimeException("Could not build trust-all SSLContext", e);
        }
    }

    // ─── Phase 1: Strict handshake (detect validity) ──────────────────────────

    /**
     * Opens a strict SSL handshake using Java's default trust store.
     * Throws SSLHandshakeException if the certificate chain is invalid/untrusted.
     * Throws SslAnalysisException for non-TLS connection failures.
     */
    public SSLSession openHandshake(String host, int port) throws SSLHandshakeException {
        try {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            SSLSocket socket = (SSLSocket) factory.createSocket(host, port);

            SSLParameters params = socket.getSSLParameters();
            params.setServerNames(Collections.singletonList(new SNIHostName(host)));
            socket.setSSLParameters(params);
            socket.setEnabledProtocols(new String[]{"TLSv1.2", "TLSv1.3"});
            socket.setSoTimeout(15000);
            socket.startHandshake();
            return socket.getSession();
        } catch (SSLHandshakeException e) {
            log.warn("Strict handshake rejected for {}:{} — certificate issue: {}", host, port, e.getMessage());
            throw e;   // re-throw so analyze() can classify it
        } catch (Exception e) {
            log.error("Connection failed for {}:{} — host may not serve TLS", host, port, e);
            throw new SslAnalysisException("Could not connect to " + host + ":" + port, e);
        }
    }

    // ─── Phase 2: Trust-all handshake (extract data from invalid certs) ───────

    /**
     * Opens an SSL session using a trust-all context.
     * Used ONLY to extract certificate chain + negotiated cipher from servers with
     * invalid/incomplete chains (e.g., missing intermediate certificates).
     *
     * Returns null if the server is completely unreachable (not just misconfigured).
     */
    public SSLSession openTrustAllHandshake(String host, int port) {
        try {
            SSLSocketFactory factory = TRUST_ALL_CTX.getSocketFactory();
            SSLSocket socket = (SSLSocket) factory.createSocket(host, port);

            SSLParameters params = socket.getSSLParameters();
            params.setServerNames(Collections.singletonList(new SNIHostName(host)));
            socket.setSSLParameters(params);
            socket.setEnabledProtocols(new String[]{"TLSv1.2", "TLSv1.3"});
            socket.setSoTimeout(15000);
            socket.startHandshake();
            return socket.getSession();
        } catch (Exception e) {
            log.warn("Trust-all handshake also failed for {}:{}: {}", host, port, e.getMessage());
            return null;
        }
    }

    // ─── Chain parsing ────────────────────────────────────────────────────────

    public List<CertInfo> parseChain(SSLSession session) {
        return CertParser.parseChain(session);
    }

    // ─── Cipher probing ───────────────────────────────────────────────────────

    /**
     * Probes which ciphers the server actually accepts.
     *
     * Improvements over original:
     *  • Tests BOTH TLSv1.2 and TLSv1.3 ciphers.
     *  • Uses trust-all context so probing works even on misconfigured servers.
     *  • The server-selected cipher from the real handshake is guaranteed to appear
     *    (added by the caller from session.getCipherSuite()).
     */
    public List<CipherSuite> probeCiphers(String host, int port, String serverSelectedCipher) {
        SSLSocketFactory factory = TRUST_ALL_CTX.getSocketFactory();
        String[] allCiphers = factory.getSupportedCipherSuites();

        // Separate TLS 1.2 and TLS 1.3 ciphers by naming convention
        // TLS 1.3 ciphers have the prefix "TLS_AES_" or "TLS_CHACHA20_"
        List<String> tls13Ciphers = Arrays.stream(allCiphers)
                .filter(c -> c.startsWith("TLS_AES_") || c.startsWith("TLS_CHACHA20_"))
                .collect(Collectors.toList());

        List<String> tls12Ciphers = Arrays.stream(allCiphers)
                .filter(c -> !c.startsWith("TLS_AES_") && !c.startsWith("TLS_CHACHA20_"))
                .collect(Collectors.toList());

        List<CompletableFuture<CipherSuite>> futures = new ArrayList<>();

        // Probe TLS 1.2 ciphers
        for (String cipher : tls12Ciphers) {
            futures.add(CompletableFuture.supplyAsync(() -> probeSingleCipher(factory, host, port, cipher, "TLSv1.2"), executorService));
        }

        // Probe TLS 1.3 ciphers — Java TLS 1.3 doesn't allow restricting individual ciphers
        // the same way, but we can at least detect TLS 1.3 support from the negotiated session.
        // We add TLS 1.3 ciphers as SECURE if the server successfully negotiates TLS 1.3.
        futures.add(CompletableFuture.supplyAsync(() -> {
            try {
                SSLSocket socket = (SSLSocket) factory.createSocket(host, port);
                SSLParameters params = socket.getSSLParameters();
                params.setServerNames(Collections.singletonList(new SNIHostName(host)));
                socket.setSSLParameters(params);
                socket.setEnabledProtocols(new String[]{"TLSv1.3"});
                socket.setSoTimeout(5000);
                socket.startHandshake();
                String negotiated = socket.getSession().getCipherSuite();
                return CipherSuite.builder()
                        .name(negotiated)
                        .protocol("TLSv1.3")
                        .grade("SECURE")
                        .build();
            } catch (Exception e) {
                return null; // Server doesn't support TLS 1.3
            }
        }, executorService));

        List<CipherSuite> result = futures.stream()
                .map(CompletableFuture::join)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(ArrayList::new));

        // Ensure the server's actually-selected cipher is always represented
        if (serverSelectedCipher != null && result.stream().noneMatch(c -> c.getName().equals(serverSelectedCipher))) {
            String proto = serverSelectedCipher.startsWith("TLS_AES_") || serverSelectedCipher.startsWith("TLS_CHACHA20_")
                           ? "TLSv1.3" : "TLSv1.2";
            result.add(0, CipherSuite.builder()
                    .name(serverSelectedCipher)
                    .protocol(proto)
                    .grade(CipherGrader.gradeByName(serverSelectedCipher))
                    .build());
        }

        return result;
    }

    private CipherSuite probeSingleCipher(SSLSocketFactory factory, String host, int port, String cipher, String protocol) {
        try {
            SSLSocket socket = (SSLSocket) factory.createSocket(host, port);
            SSLParameters params = socket.getSSLParameters();
            params.setServerNames(Collections.singletonList(new SNIHostName(host)));
            socket.setSSLParameters(params);
            socket.setEnabledProtocols(new String[]{protocol});
            socket.setEnabledCipherSuites(new String[]{cipher});
            socket.setSoTimeout(4000);
            socket.startHandshake();
            return CipherSuite.builder()
                    .name(cipher)
                    .protocol(socket.getSession().getProtocol())
                    .grade(CipherGrader.gradeByName(cipher))
                    .build();
        } catch (SSLHandshakeException e) {
            return null; // Server rejected this cipher
        } catch (Exception e) {
            return null;
        }
    }

    // ─── HSTS ─────────────────────────────────────────────────────────────────

    /**
     * Fetches HSTS header via real HTTP GET (not raw socket).
     * Uses GET (not HEAD) — some CDNs omit HSTS on HEAD requests.
     */
    public HstsInfo checkHsts(String hostname) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://" + hostname))
                    .GET()
                    .timeout(Duration.ofSeconds(10))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String hstsHeader = response.headers().firstValue("Strict-Transport-Security").orElse(null);

            if (hstsHeader == null) {
                return HstsInfo.builder().present(false).build();
            }

            long maxAge = 0;
            Matcher m = Pattern.compile("max-age=(\\d+)").matcher(hstsHeader);
            if (m.find()) {
                maxAge = Long.parseLong(m.group(1));
            }

            boolean includeSubDomains = hstsHeader.toLowerCase().contains("includesubdomains");
            boolean preload = hstsHeader.toLowerCase().contains("preload");

            return HstsInfo.builder()
                    .present(true)
                    .maxAge(maxAge)
                    .includeSubDomains(includeSubDomains)
                    .preload(preload)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to check HSTS for {}: {}", hostname, e.getMessage());
            return HstsInfo.builder().present(false).build();
        }
    }

    // ─── CT log check ─────────────────────────────────────────────────────────

    /**
     * Checks Certificate Transparency logs using crt.sh.
     * Returns:
     *   Boolean.TRUE  — certificate found in CT logs
     *   Boolean.FALSE — CT logs reachable but cert not found
     *   null          — CT service unavailable (502 / timeout / rate-limited)
     */
    public Boolean checkCtLog(String hostname) {
        try {
            WebClient client = webClientBuilder.build();
            String response = client.get()
                    .uri("https://crt.sh/?q=" + hostname + "&output=json")
                    .retrieve()
                    .bodyToMono(String.class)
                    .retry(2)
                    .timeout(Duration.ofSeconds(8))
                    .block();

            return response != null && !response.trim().isEmpty() && !response.trim().equals("[]");
        } catch (Exception e) {
            log.warn("CT log check skipped for {} (external service unavailable: {}) — continuing scan", hostname, e.getMessage());
            return null;
        }
    }

    // ─── CAA lookup ───────────────────────────────────────────────────────────

    public List<String> lookupCaa(String domain) {
        List<String> results = new ArrayList<>();
        try {
            Record[] records = new Lookup(domain, Type.CAA).run();
            if (records != null) {
                for (Record r : records) {
                    results.add(r.toString());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to lookup CAA for {}: {}", domain, e.getMessage());
        }
        return results;
    }

    // ─── Grading ──────────────────────────────────────────────────────────────

    /**
     * Computes the overall grade.
     *
     * TLS-1.3-aware logic:
     *  If the server negotiated TLS 1.3 (best available), CBC fallback ciphers listed
     *  for TLS 1.2 compatibility are NOT penalised — they don't represent actual weakness
     *  in the security posture.
     */
    public String computeGrade(List<CipherSuite> ciphers, List<String> protocols,
                                HstsInfo hsts, List<CertInfo> chain,
                                Boolean ctLogged, List<String> caaRecords) {

        boolean hasTls13          = protocols != null && protocols.contains("TLSv1.3");
        boolean hasInsecureCipher = ciphers.stream().anyMatch(c -> "INSECURE".equals(c.getGrade()));
        boolean hasLegacyCipher   = ciphers.stream().anyMatch(c -> "LEGACY".equals(c.getGrade()));
        boolean hasDeprecatedTls  = protocols != null && (protocols.contains("TLSv1") || protocols.contains("TLSv1.1"));
        boolean expiredCert       = !chain.isEmpty() && chain.get(0).getDaysRemaining() <= 0;
        boolean hstsPresent       = hsts != null && hsts.isPresent();
        boolean hasCaa            = caaRecords != null && !caaRecords.isEmpty();
        boolean ctConfirmed       = Boolean.TRUE.equals(ctLogged);
        boolean ctAvailable       = ctLogged != null;

        // F: any truly broken cipher, deprecated TLS, or expired cert
        if (hasInsecureCipher || hasDeprecatedTls || expiredCert) {
            return "F";
        }

        // If TLS 1.3 is the negotiated protocol, CBC ciphers are only fallback.
        // Don't penalise — treat as if no legacy cipher for grading purposes.
        boolean effectiveLegacy = hasLegacyCipher && !hasTls13;

        // A+: strongest possible — AEAD only (or TLS 1.3 primary), HSTS+preload, CAA, CT confirmed
        if (!effectiveLegacy && !hasInsecureCipher && hstsPresent && hsts.isPreload()
                && hasCaa && (ctConfirmed || !ctAvailable)) {
            return "A+";
        }

        // A: strong ciphers, HSTS present
        if (!effectiveLegacy && !hasInsecureCipher && hstsPresent) {
            return "A";
        }

        // A-: has legacy CBC ciphers as primary, but HSTS is present
        if (effectiveLegacy && hstsPresent) {
            return "A-";
        }

        // B: no insecure/legacy (or TLS 1.3 primary), but HSTS missing
        if (!effectiveLegacy && !hasInsecureCipher) {
            return "B";
        }

        // C: legacy ciphers with no HSTS
        return "C";
    }

    public int computeScore(String grade) {
        switch (grade) {
            case "A+":  return 100;
            case "A":   return 90;
            case "A-":  return 80;
            case "B":   return 70;
            case "C":   return 50;
            case "F":   return 20;
            default:    return 0;
        }
    }

    // ─── Warning builder ──────────────────────────────────────────────────────

    public List<String> buildWarnings(List<CipherSuite> ciphers, List<String> protocols,
                                       HstsInfo hsts, List<CertInfo> chain,
                                       List<String> caaRecords, Boolean ctLogged) {
        List<String> warnings = new ArrayList<>();
        boolean hasTls13 = protocols != null && protocols.contains("TLSv1.3");

        List<String> insecureCiphers = ciphers.stream()
                .filter(c -> "INSECURE".equals(c.getGrade())).map(CipherSuite::getName).collect(Collectors.toList());
        if (!insecureCiphers.isEmpty()) {
            warnings.add("Insecure cipher suites supported (RC4, NULL, DES, bare RSA): " + String.join(", ", insecureCiphers));
        }

        List<String> legacyCiphers = ciphers.stream()
                .filter(c -> "LEGACY".equals(c.getGrade())).map(CipherSuite::getName).collect(Collectors.toList());
        if (!legacyCiphers.isEmpty()) {
            if (hasTls13) {
                warnings.add("Legacy CBC cipher suites present for TLS 1.2 fallback compatibility (not used when TLS 1.3 is negotiated): "
                        + String.join(", ", legacyCiphers));
            } else {
                warnings.add("Legacy cipher suites in active use (CBC-based — forward-secret but not modern): "
                        + String.join(", ", legacyCiphers));
            }
        }

        if (protocols != null && (protocols.contains("TLSv1") || protocols.contains("TLSv1.1"))) {
            warnings.add("Deprecated TLS versions still enabled (TLS 1.0 / TLS 1.1)");
        }

        if (hsts == null || !hsts.isPresent()) {
            warnings.add("HSTS header missing — site is vulnerable to SSL-stripping attacks");
        } else if (hsts.getMaxAge() < 15552000) {
            warnings.add("HSTS max-age is too short (minimum recommended: 180 days)");
        }

        if (caaRecords == null || caaRecords.isEmpty()) {
            warnings.add("No CAA DNS records found — any CA can issue certificates for this domain");
        }

        if (ctLogged == null) {
            warnings.add("Certificate Transparency status unknown — CT log service (crt.sh) was unavailable during scan");
        } else if (!ctLogged) {
            warnings.add("Certificate not found in Certificate Transparency logs — potential mis-issuance risk");
        }

        if (!chain.isEmpty()) {
            CertInfo leaf = chain.get(0);
            if (leaf.getDaysRemaining() <= 0) {
                warnings.add("Certificate has EXPIRED");
            } else if (leaf.getDaysRemaining() < 30) {
                warnings.add("Certificate expires in " + leaf.getDaysRemaining() + " days — renew soon");
            }
        }

        boolean hasSelfSigned = chain.stream().anyMatch(CertInfo::isSelfSigned);
        if (hasSelfSigned) {
            warnings.add("Self-signed certificate detected in chain — not trusted by standard clients");
        }

        return warnings;
    }

    // ─── Host normalisation ───────────────────────────────────────────────────

    public String normalizeHost(String input) {
        if (input == null || input.trim().isEmpty()) return input;
        try {
            String uriString = input;
            if (!uriString.startsWith("http://") && !uriString.startsWith("https://")) {
                uriString = "https://" + uriString;
            }
            java.net.URI uri = new java.net.URI(uriString);
            return uri.getHost() != null ? uri.getHost() : input;
        } catch (Exception e) {
            return input.replace("https://", "").replace("http://", "").replace("/", "");
        }
    }

    // ─── Main entry point ─────────────────────────────────────────────────────

    /**
     * Performs the complete SSL/TLS analysis.
     *
     * Two-phase strategy:
     *  Phase 1 — strict handshake to determine certificate validity.
     *  Phase 2 — trust-all handshake to extract chain/ciphers even from misconfigured servers.
     */
    public SslScanResult analyze(String hostname, int port, String userId, String userEmail) {
        String host = normalizeHost(hostname);
        log.info("Starting SSL/TLS analysis for {}:{}", host, port);

        // ── Phase 1: Strict handshake ──────────────────────────────────────────
        boolean certValid = true;
        String grade = null;
        String certIssue = null;

        SSLSession strictSession = null;
        try {
            strictSession = openHandshake(host, port);
        } catch (SSLHandshakeException e) {
            certValid = false;
            Throwable cause = e.getCause();
            if (cause != null && cause.getMessage() != null && cause.getMessage().contains("CertificateExpiredException")) {
                grade = "EXPIRED_CERT";
                certIssue = "Certificate has expired — the site's SSL certificate is no longer valid.";
            } else if (cause != null && cause.toString().contains("self signed")) {
                grade = "SELF_SIGNED";
                certIssue = "Self-signed certificate — not issued by a trusted Certificate Authority.";
            } else {
                grade = "INVALID_CERT";
                certIssue = "Invalid or untrusted certificate chain — " + e.getMessage()
                        + ". Likely cause: missing intermediate certificate on the server.";
            }
            log.warn("Certificate issue detected for {}:{} → {}: {}", host, port, grade, certIssue);
        } catch (Exception e) {
            // Not serving TLS at all
            log.warn("Connection failed for {}:{}: {}", host, port, e.getMessage());
            SslScanResult noHttps = SslScanResult.builder()
                    .userId(userId).userEmail(userEmail)
                    .hostname(hostname).port(port)
                    .scannedAt(Instant.now())
                    .grade("NO_HTTPS").score(0)
                    .warnings(List.of("Server is not accepting SSL/TLS connections on port " + port + "."))
                    .build();
            return sslScanRepository.save(noHttps);
        }

        // ── Phase 2: Trust-all handshake (always runs so we can extract data) ─
        SSLSession analysisSession = certValid ? strictSession : openTrustAllHandshake(host, port);

        if (analysisSession == null) {
            // Even trust-all failed — server truly unreachable
            SslScanResult fallback = SslScanResult.builder()
                    .userId(userId).userEmail(userEmail)
                    .hostname(hostname).port(port)
                    .scannedAt(Instant.now())
                    .grade(grade != null ? grade : "NO_HTTPS").score(0)
                    .warnings(List.of(certIssue != null ? certIssue : "Server unreachable."))
                    .build();
            return sslScanRepository.save(fallback);
        }

        // ── Extract data from the analysis session ─────────────────────────────
        List<CertInfo> chain = parseChain(analysisSession);
        String negotiatedCipher = analysisSession.getCipherSuite();
        String negotiatedProtocol = analysisSession.getProtocol();
        log.info("Negotiated: {} / {}", negotiatedProtocol, negotiatedCipher);

        // ── Concurrent probes ──────────────────────────────────────────────────
        List<CipherSuite> ciphers = probeCiphers(host, port, negotiatedCipher);

        // Collect ALL protocols seen across ciphers + the negotiated one
        List<String> protocols = ciphers.stream()
                .map(CipherSuite::getProtocol)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
        if (!protocols.contains(negotiatedProtocol)) {
            protocols.add(0, negotiatedProtocol);
        }

        CompletableFuture<HstsInfo> hstsFuture = CompletableFuture.supplyAsync(() -> checkHsts(host), executorService);
        CompletableFuture<Boolean> ctFuture = CompletableFuture.supplyAsync(() -> checkCtLog(host), executorService);
        CompletableFuture<List<String>> caaFuture = CompletableFuture.supplyAsync(() -> lookupCaa(host), executorService);

        CompletableFuture.allOf(hstsFuture, ctFuture, caaFuture).join();

        HstsInfo hsts = hstsFuture.join();
        Boolean ctLogged = ctFuture.join();
        List<String> caaRecords = caaFuture.join();

        String ctLogStatus = ctLogged == null ? "UNAVAILABLE" : ctLogged ? "LOGGED" : "NOT_FOUND";

        // ── Grade (override with cert failure if applicable) ───────────────────
        if (certValid) {
            grade = computeGrade(ciphers, protocols, hsts, chain, ctLogged, caaRecords);
        }
        // If cert is invalid, grade was already set above (INVALID_CERT / EXPIRED_CERT / SELF_SIGNED)
        // but score stays 0 to reflect the security failure.

        int score = certValid ? computeScore(grade) : 0;
        List<String> warnings = buildWarnings(ciphers, protocols, hsts, chain, caaRecords, ctLogged);
        if (!certValid && certIssue != null) {
            warnings.add(0, certIssue);  // surface cert issue at the top
        }

        SslScanResult result = SslScanResult.builder()
                .userId(userId).userEmail(userEmail)
                .hostname(hostname).port(port)
                .scannedAt(Instant.now())
                .grade(grade).score(score)
                .chain(chain)
                .ciphers(ciphers)
                .protocols(protocols)
                .hsts(hsts)
                .ctLogged(Boolean.TRUE.equals(ctLogged))
                .ctLogStatus(ctLogStatus)
                .caaRecords(caaRecords)
                .warnings(warnings)
                .build();

        return sslScanRepository.save(result);
    }
}
