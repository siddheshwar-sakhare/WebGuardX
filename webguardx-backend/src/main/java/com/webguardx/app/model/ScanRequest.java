package com.webguardx.app.model;

public class ScanRequest {
    private String url;
    private boolean activeScan;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isActiveScan() {
        return activeScan;
    }

    public void setActiveScan(boolean activeScan) {
        this.activeScan = activeScan;
    }
}
