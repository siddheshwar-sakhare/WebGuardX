package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapDosRisk {
    private boolean vulnerable;
    private String riskLevel;
    private List<String> vulnerableServices;
    private List<String> dosScripts;
    private String description;
    private String recommendation;
    
    // Getters and setters
    public boolean isVulnerable() { return vulnerable; }
    public void setVulnerable(boolean vulnerable) { this.vulnerable = vulnerable; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public List<String> getVulnerableServices() { return vulnerableServices; }
    public void setVulnerableServices(List<String> vulnerableServices) { this.vulnerableServices = vulnerableServices; }
    
    public List<String> getDosScripts() { return dosScripts; }
    public void setDosScripts(List<String> dosScripts) { this.dosScripts = dosScripts; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}
