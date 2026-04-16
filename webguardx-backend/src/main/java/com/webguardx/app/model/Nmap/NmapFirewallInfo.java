package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapFirewallInfo {
    private boolean firewallDetected;
    private boolean idsDetected;
    private List<String> detectedTechniques;
    private String evasionMethod;
    private List<NmapFilteredPort> filteredPorts;
    private String firewallType;
    private boolean packetFilterDetected;
    private boolean statefulInspection;
    
    // Getters and setters
    public boolean isFirewallDetected() { return firewallDetected; }
    public void setFirewallDetected(boolean firewallDetected) { this.firewallDetected = firewallDetected; }
    
    public boolean isIdsDetected() { return idsDetected; }
    public void setIdsDetected(boolean idsDetected) { this.idsDetected = idsDetected; }
    
    public List<String> getDetectedTechniques() { return detectedTechniques; }
    public void setDetectedTechniques(List<String> detectedTechniques) { this.detectedTechniques = detectedTechniques; }
    
    public String getEvasionMethod() { return evasionMethod; }
    public void setEvasionMethod(String evasionMethod) { this.evasionMethod = evasionMethod; }
    
    public List<NmapFilteredPort> getFilteredPorts() { return filteredPorts; }
    public void setFilteredPorts(List<NmapFilteredPort> filteredPorts) { this.filteredPorts = filteredPorts; }
    
    public String getFirewallType() { return firewallType; }
    public void setFirewallType(String firewallType) { this.firewallType = firewallType; }
    
    public boolean isPacketFilterDetected() { return packetFilterDetected; }
    public void setPacketFilterDetected(boolean packetFilterDetected) { this.packetFilterDetected = packetFilterDetected; }
    
    public boolean isStatefulInspection() { return statefulInspection; }
    public void setStatefulInspection(boolean statefulInspection) { this.statefulInspection = statefulInspection; }
}
