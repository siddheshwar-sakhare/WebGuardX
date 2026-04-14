package com.webguardx.app.controller;

import com.webguardx.app.model.ScanHistory;
import com.webguardx.app.repository.ScanHistoryRepository;
import com.webguardx.app.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/zap/export")
public class ExportController {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @Autowired
    private ExportService exportService;

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        Optional<ScanHistory> historyOpt = scanHistoryRepository.findById(id);

        if (historyOpt.isEmpty() || !historyOpt.get().getUserEmail().equals(email)) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = exportService.generatePdfReport(historyOpt.get());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "scan_report_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/csv")
    public ResponseEntity<byte[]> exportCsv(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        Optional<ScanHistory> historyOpt = scanHistoryRepository.findById(id);

        if (historyOpt.isEmpty() || !historyOpt.get().getUserEmail().equals(email)) {
             return ResponseEntity.notFound().build();
        }

        byte[] csvBytes = exportService.generateCsvReport(historyOpt.get());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "scan_report_" + id + ".csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
