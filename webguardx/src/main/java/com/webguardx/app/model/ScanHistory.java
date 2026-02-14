package com.webguardx.app.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scan_history")
public class ScanHistory {

    @Id
    private String id;

    private String userId;
    private String userEmail;

    private String targetUrl;
    private boolean activeScan;

    private String status;
    private LocalDateTime scannedAt;

    private List<ZapAlert> alerts;

    public ScanHistory() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public boolean isActiveScan() {
        return activeScan;
    }

    public void setActiveScan(boolean activeScan) {
        this.activeScan = activeScan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(LocalDateTime scannedAt) {
        this.scannedAt = scannedAt;
    }

    public List<ZapAlert> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<ZapAlert> alerts) {
        this.alerts = alerts;
    }
}
