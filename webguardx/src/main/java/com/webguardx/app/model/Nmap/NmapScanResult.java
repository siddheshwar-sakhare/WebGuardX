package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapScanResult {
    private String target;
    private String status;
    private String message;
    private NmapHostInfo hostInfo;
    private List<NmapPort> openPorts;
    private List<NmapPort> filteredPorts;
    private List<NmapPort> closedPorts;
    private List<NmapVulnerability> vulnerabilities;
    private List<NmapServiceInfo> detectedServices;
    private NmapOsDetection osInfo;
    private NmapFirewallInfo firewallInfo;
    private List<NmapDevice> discoveredDevices;
    private NmapSslInfo sslInfo;
    private List<NmapBruteForceRisk> bruteForceRisks;
    private List<NmapMisconfiguration> misconfigurations;
    private List<NmapCve> cveFindings;
    private NmapDosRisk dosRisk;
    private String rawOutput;
    private long scanDuration;
    
    // Constructors
    public NmapScanResult() {}
    
    public NmapScanResult(String status, String message) {
        this.status = status;
        this.message = message;
    }
    
    // Getters and setters for all fields
    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public NmapHostInfo getHostInfo() { return hostInfo; }
    public void setHostInfo(NmapHostInfo hostInfo) { this.hostInfo = hostInfo; }
    
    public List<NmapPort> getOpenPorts() { return openPorts; }
    public void setOpenPorts(List<NmapPort> openPorts) { this.openPorts = openPorts; }
    
    public List<NmapPort> getFilteredPorts() { return filteredPorts; }
    public void setFilteredPorts(List<NmapPort> filteredPorts) { this.filteredPorts = filteredPorts; }
    
    public List<NmapPort> getClosedPorts() { return closedPorts; }
    public void setClosedPorts(List<NmapPort> closedPorts) { this.closedPorts = closedPorts; }
    
    public List<NmapVulnerability> getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(List<NmapVulnerability> vulnerabilities) { this.vulnerabilities = vulnerabilities; }
    
    public List<NmapServiceInfo> getDetectedServices() { return detectedServices; }
    public void setDetectedServices(List<NmapServiceInfo> detectedServices) { this.detectedServices = detectedServices; }
    
    public NmapOsDetection getOsInfo() { return osInfo; }
    public void setOsInfo(NmapOsDetection osInfo) { this.osInfo = osInfo; }
    
    public NmapFirewallInfo getFirewallInfo() { return firewallInfo; }
    public void setFirewallInfo(NmapFirewallInfo firewallInfo) { this.firewallInfo = firewallInfo; }
    
    public List<NmapDevice> getDiscoveredDevices() { return discoveredDevices; }
    public void setDiscoveredDevices(List<NmapDevice> discoveredDevices) { this.discoveredDevices = discoveredDevices; }
    
    public NmapSslInfo getSslInfo() { return sslInfo; }
    public void setSslInfo(NmapSslInfo sslInfo) { this.sslInfo = sslInfo; }
    
    public List<NmapBruteForceRisk> getBruteForceRisks() { return bruteForceRisks; }
    public void setBruteForceRisks(List<NmapBruteForceRisk> bruteForceRisks) { this.bruteForceRisks = bruteForceRisks; }
    
    public List<NmapMisconfiguration> getMisconfigurations() { return misconfigurations; }
    public void setMisconfigurations(List<NmapMisconfiguration> misconfigurations) { this.misconfigurations = misconfigurations; }
    
    public List<NmapCve> getCveFindings() { return cveFindings; }
    public void setCveFindings(List<NmapCve> cveFindings) { this.cveFindings = cveFindings; }
    
    public NmapDosRisk getDosRisk() { return dosRisk; }
    public void setDosRisk(NmapDosRisk dosRisk) { this.dosRisk = dosRisk; }
    
    public String getRawOutput() { return rawOutput; }
    public void setRawOutput(String rawOutput) { this.rawOutput = rawOutput; }
    
    public long getScanDuration() { return scanDuration; }
    public void setScanDuration(long scanDuration) { this.scanDuration = scanDuration; }
}
