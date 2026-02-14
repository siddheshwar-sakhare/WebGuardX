package com.webguardx.app.model;

import java.util.List;

public class ScanResult {

    private String status;
    private List<ZapAlert> results;

    public ScanResult(String status, List<ZapAlert> results) {
        this.status = status;
        this.results = results;
    }

    public String getStatus() {
        return status;
    }

    public List<ZapAlert> getResults() {
        return results;
    }
}
