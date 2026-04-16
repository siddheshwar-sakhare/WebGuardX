package com.webguardx.app.model.Nmap;

public class NmapBruteForceRisk {
    private String service;
    private int port;
    private String risk;
    private String recommendation;
    private boolean defaultCredentials;
    private boolean weakAuthentication;
    
    // Getters and setters
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getRisk() { return risk; }
    public void setRisk(String risk) { this.risk = risk; }
    
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    
    public boolean isDefaultCredentials() { return defaultCredentials; }
    public void setDefaultCredentials(boolean defaultCredentials) { this.defaultCredentials = defaultCredentials; }
    
    public boolean isWeakAuthentication() { return weakAuthentication; }
    public void setWeakAuthentication(boolean weakAuthentication) { this.weakAuthentication = weakAuthentication; }
}
