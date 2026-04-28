package com.webguardx.app.model;

public class ApiTestResult {

    private String endpoint;
    private boolean brokenAuth;
    private boolean dataExposure;
    private boolean rateLimited;
    private String riskLevel;

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public boolean isBrokenAuth() {
        return brokenAuth;
    }

    public void setBrokenAuth(boolean brokenAuth) {
        this.brokenAuth = brokenAuth;
    }

    public boolean isDataExposure() {
        return dataExposure;
    }

    public void setDataExposure(boolean dataExposure) {
        this.dataExposure = dataExposure;
    }

    public boolean isRateLimited() {
        return rateLimited;
    }

    public void setRateLimited(boolean rateLimited) {
        this.rateLimited = rateLimited;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
