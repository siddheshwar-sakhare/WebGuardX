package com.webguardx.app.model.Nmap;

public class NmapMisconfiguration {
    private String type;
    private String description;
    private String impact;
    private String recommendation;
    private int port;
    private String service;
    private String severity;
    
    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
    
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
