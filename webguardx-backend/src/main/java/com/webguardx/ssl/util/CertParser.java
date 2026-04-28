package com.webguardx.ssl.util;

import com.webguardx.ssl.model.CertInfo;

import javax.net.ssl.SSLSession;
import java.security.cert.Certificate;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility to parse X509 certificates from an SSLSession.
 */
public class CertParser {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CertParser.class);

    /**
     * Parses the certificate chain from an SSL session.
     * @param session the SSLSession
     * @return a list of CertInfo objects representing the chain
     */
    public static List<CertInfo> parseChain(SSLSession session) {
        List<CertInfo> chain = new ArrayList<>();
        try {
            Certificate[] peerCertificates = session.getPeerCertificates();
            for (Certificate cert : peerCertificates) {
                if (cert instanceof X509Certificate) {
                    X509Certificate x509 = (X509Certificate) cert;
                    
                    String subject = x509.getSubjectX500Principal().getName();
                    String issuer = x509.getIssuerX500Principal().getName();
                    Instant notBefore = x509.getNotBefore().toInstant();
                    Instant notAfter = x509.getNotAfter().toInstant();
                    long daysRemaining = ChronoUnit.DAYS.between(Instant.now(), notAfter);
                    
                    List<String> sans = extractSans(x509);
                    
                    String keyAlgorithm = x509.getPublicKey().getAlgorithm();
                    // To get accurate size, one would need to inspect specific key types (RSAKey, ECKey).
                    // We'll estimate or just set 0 if not easily accessible.
                    int keySize = extractKeySize(x509.getPublicKey());
                    
                    String signatureAlgorithm = x509.getSigAlgName();
                    boolean isSelfSigned = subject.equals(issuer);
                    
                    CertInfo info = CertInfo.builder()
                            .subject(subject)
                            .issuer(issuer)
                            .notBefore(notBefore)
                            .notAfter(notAfter)
                            .daysRemaining(daysRemaining)
                            .sans(sans)
                            .keyAlgorithm(keyAlgorithm)
                            .keySize(keySize)
                            .signatureAlgorithm(signatureAlgorithm)
                            .isSelfSigned(isSelfSigned)
                            .build();
                            
                    chain.add(info);
                }
            }
        } catch (Exception e) {
            log.error("Error parsing certificate chain", e);
        }
        return chain;
    }
    
    private static List<String> extractSans(X509Certificate cert) {
        List<String> sans = new ArrayList<>();
        try {
            Collection<List<?>> alternativeNames = cert.getSubjectAlternativeNames();
            if (alternativeNames != null) {
                for (List<?> san : alternativeNames) {
                    // Type 2 is dNSName, type 7 is iPAddress
                    if (san.size() >= 2 && (Integer.valueOf(2).equals(san.get(0)) || Integer.valueOf(7).equals(san.get(0)))) {
                        sans.add(String.valueOf(san.get(1)));
                    }
                }
            }
        } catch (CertificateParsingException e) {
            log.warn("Failed to parse Subject Alternative Names", e);
        }
        return sans;
    }
    
    private static int extractKeySize(java.security.PublicKey publicKey) {
        if (publicKey instanceof java.security.interfaces.RSAKey) {
            return ((java.security.interfaces.RSAKey) publicKey).getModulus().bitLength();
        } else if (publicKey instanceof java.security.interfaces.ECKey) {
            return ((java.security.interfaces.ECKey) publicKey).getParams().getCurve().getField().getFieldSize();
        } else if (publicKey instanceof java.security.interfaces.DSAPublicKey) {
            return ((java.security.interfaces.DSAPublicKey) publicKey).getParams().getP().bitLength();
        }
        return 0; // Unknown
    }
}
