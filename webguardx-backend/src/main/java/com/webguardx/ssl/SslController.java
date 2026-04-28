package com.webguardx.ssl;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.webguardx.app.model.User;
import com.webguardx.app.repository.UserRepository;
import com.webguardx.ssl.model.CertInfo;
import com.webguardx.ssl.model.CipherSuite;
import com.webguardx.ssl.model.SslScanResult;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/ssl")
@CrossOrigin(origins = "*")
public class SslController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SslController.class);

    private final SslAnalyzerService analyzerService;
    private final SslScanRepository scanRepository;
    private final UserRepository userRepository;

    public SslController(SslAnalyzerService analyzerService, SslScanRepository scanRepository, UserRepository userRepository) {
        this.analyzerService = analyzerService;
        this.scanRepository = scanRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) return null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null || "anonymousUser".equals(principal)) {
            return null;
        }
        String email = (String) principal;
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/analyze")
    public ResponseEntity<SslScanResult> analyze(@RequestBody SslScanRequest request) {
        if (request.getHostname() == null || request.getHostname().trim().isEmpty()) {
            throw new IllegalArgumentException("Hostname cannot be blank");
        }
        if (request.getPort() < 1 || request.getPort() > 65535) {
            throw new IllegalArgumentException("Port must be between 1 and 65535");
        }
        
        User user = getAuthenticatedUser();
        String userId = user != null ? user.getId() : "anonymous";
        String userEmail = user != null ? user.getEmail() : "anonymous";
        
        SslScanResult result = analyzerService.analyze(request.getHostname(), request.getPort(), userId, userEmail);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SslScanResult>> getHistory() {
        User user = getAuthenticatedUser();
        List<SslScanResult> results = scanRepository.findByUserEmailOrderByScannedAtDesc(user.getEmail());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<SslScanResult> getHistoryById(@PathVariable String id) {
        User user = getAuthenticatedUser();
        SslScanResult result = scanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scan not found"));
                
        if (!result.getUserEmail().equals(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/export/{id}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable String id) {
        User user = getAuthenticatedUser();
        SslScanResult result = scanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scan not found"));
                
        if (!result.getUserEmail().equals(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            // Header
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            document.add(new Paragraph("SSL/TLS Scan Report", titleFont));
            document.add(new Paragraph("Hostname: " + result.getHostname()));
            document.add(new Paragraph("Grade: " + result.getGrade() + " (Score: " + result.getScore() + ")"));
            document.add(new Paragraph("Scan Date: " + result.getScannedAt().toString()));
            document.add(new Paragraph("\n"));

            // Warnings
            if (result.getWarnings() != null && !result.getWarnings().isEmpty()) {
                Font warningFont = new Font(Font.HELVETICA, 14, Font.BOLD);
                document.add(new Paragraph("Warnings:", warningFont));
                for (String warning : result.getWarnings()) {
                    document.add(new Paragraph("- " + warning));
                }
                document.add(new Paragraph("\n"));
            }

            // Cert Chain Table
            if (result.getChain() != null && !result.getChain().isEmpty()) {
                Font headerFont = new Font(Font.HELVETICA, 14, Font.BOLD);
                document.add(new Paragraph("Certificate Chain:", headerFont));
                document.add(new Paragraph("\n"));
                
                PdfPTable certTable = new PdfPTable(4);
                certTable.setWidthPercentage(100);
                certTable.addCell(new PdfPCell(new Paragraph("Subject")));
                certTable.addCell(new PdfPCell(new Paragraph("Issuer")));
                certTable.addCell(new PdfPCell(new Paragraph("Expiry")));
                certTable.addCell(new PdfPCell(new Paragraph("Days Remaining")));
                
                for (CertInfo cert : result.getChain()) {
                    certTable.addCell(cert.getSubject());
                    certTable.addCell(cert.getIssuer());
                    certTable.addCell(cert.getNotAfter().toString());
                    certTable.addCell(String.valueOf(cert.getDaysRemaining()));
                }
                document.add(certTable);
                document.add(new Paragraph("\n"));
            }

            // Ciphers Table
            if (result.getCiphers() != null && !result.getCiphers().isEmpty()) {
                Font headerFont = new Font(Font.HELVETICA, 14, Font.BOLD);
                document.add(new Paragraph("Supported Cipher Suites:", headerFont));
                document.add(new Paragraph("\n"));
                
                PdfPTable cipherTable = new PdfPTable(3);
                cipherTable.setWidthPercentage(100);
                cipherTable.addCell(new PdfPCell(new Paragraph("Name")));
                cipherTable.addCell(new PdfPCell(new Paragraph("Protocol")));
                cipherTable.addCell(new PdfPCell(new Paragraph("Grade")));
                
                for (CipherSuite cipher : result.getCiphers()) {
                    cipherTable.addCell(cipher.getName());
                    cipherTable.addCell(cipher.getProtocol());
                    cipherTable.addCell(cipher.getGrade());
                }
                document.add(cipherTable);
            }

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ssl_report_" + result.getHostname() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(baos.toByteArray());
                    
        } catch (Exception e) {
            log.error("Failed to generate PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        log.error("Error in SSL Controller", e);
        if (e instanceof IllegalArgumentException || e instanceof SslAnalysisException) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.internalServerError().body(e.getMessage());
    }
}
