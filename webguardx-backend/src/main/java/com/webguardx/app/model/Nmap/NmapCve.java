package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapCve {
    private String id;
    private String description;
    private double cvssScore;
    private String severity;
    private String affectedService;
    private int affectedPort;
    private String exploitAvailable;
    private String patchAvailable;
    private List<String> references;
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public double getCvssScore() { return cvssScore; }
    public void setCvssScore(double cvssScore) { this.cvssScore = cvssScore; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    
    public String getAffectedService() { return affectedService; }
    public void setAffectedService(String affectedService) { this.affectedService = affectedService; }
    
    public int getAffectedPort() { return affectedPort; }
    public void setAffectedPort(int affectedPort) { this.affectedPort = affectedPort; }
    
    public String getExploitAvailable() { return exploitAvailable; }
    public void setExploitAvailable(String exploitAvailable) { this.exploitAvailable = exploitAvailable; }
    
    public String getPatchAvailable() { return patchAvailable; }
    public void setPatchAvailable(String patchAvailable) { this.patchAvailable = patchAvailable; }
    
    public List<String> getReferences() { return references; }
    public void setReferences(List<String> references) { this.references = references; }
}
