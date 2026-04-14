package com.webguardx.app.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.webguardx.app.model.ScanHistory;
import com.webguardx.app.model.ZapAlert;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ExportService {

    public byte[] generatePdfReport(ScanHistory history) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Paragraph title = new Paragraph("WebGuardX Security Scan Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.DARK_GRAY);
            document.add(new Paragraph("Target URL: " + history.getTargetUrl(), bodyFont));
            document.add(new Paragraph("Scan Date: " + history.getScannedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), bodyFont));
            document.add(new Paragraph("Status: " + history.getStatus(), bodyFont));
            document.add(new Paragraph("Total Alerts: " + (history.getAlerts() != null ? history.getAlerts().size() : 0), bodyFont));
            document.add(new Paragraph("Active Scan Enabled: " + history.isActiveScan(), bodyFont));
            document.add(new Paragraph(" "));

            if (history.getAlerts() != null && !history.getAlerts().isEmpty()) {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{3f, 1f, 1f, 4f});
                table.setSpacingBefore(10);

                Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
                addPdfHeader(table, "Test Name", headFont);
                addPdfHeader(table, "Risk", headFont);
                addPdfHeader(table, "Confidence", headFont);
                addPdfHeader(table, "Description", headFont);

                Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
                for (ZapAlert alert : history.getAlerts()) {
                    addPdfCell(table, alert.getTestName(), cellFont);
                    addPdfCell(table, alert.getRisk(), cellFont);
                    addPdfCell(table, alert.getConfidence(), cellFont);
                    addPdfCell(table, alert.getDescription(), cellFont);
                }
                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addPdfHeader(PdfPTable table, String header, Font headFont) {
        PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
        cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addPdfCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setPadding(5);
        table.addCell(cell);
    }

    public byte[] generateCsvReport(ScanHistory history) {
        StringBuilder csv = new StringBuilder();
        csv.append("Test Name,Risk,Confidence,URL\n");

        if (history.getAlerts() != null) {
            for (ZapAlert alert : history.getAlerts()) {
                csv.append(escapeCsv(alert.getTestName())).append(",")
                   .append(escapeCsv(alert.getRisk())).append(",")
                   .append(escapeCsv(alert.getConfidence())).append(",")
                   .append(escapeCsv(alert.getUrl())).append("\n");
            }
        }
        return csv.toString().getBytes();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }
}
