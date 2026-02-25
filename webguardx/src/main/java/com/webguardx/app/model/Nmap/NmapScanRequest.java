package com.webguardx.app.model.Nmap;

public class NmapScanRequest {
    private String target;
    private boolean quickScan;
    private boolean fullScan;
    private boolean osDetection;
    private boolean versionDetection;
    private boolean vulnerabilityScan;
    private boolean firewallEvasion;
    private boolean sslTest;
    private boolean bruteForceCheck;
    private boolean udpScan;
    private String customPorts;
    private int scanSpeed = 3; // T1-T5, default T3
    
    // Getters and setters
    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }
    
    public boolean isQuickScan() { return quickScan; }
    public void setQuickScan(boolean quickScan) { this.quickScan = quickScan; }
    
    public boolean isFullScan() { return fullScan; }
    public void setFullScan(boolean fullScan) { this.fullScan = fullScan; }
    
    public boolean isOsDetection() { return osDetection; }
    public void setOsDetection(boolean osDetection) { this.osDetection = osDetection; }
    
    public boolean isVersionDetection() { return versionDetection; }
    public void setVersionDetection(boolean versionDetection) { this.versionDetection = versionDetection; }
    
    public boolean isVulnerabilityScan() { return vulnerabilityScan; }
    public void setVulnerabilityScan(boolean vulnerabilityScan) { this.vulnerabilityScan = vulnerabilityScan; }
    
    public boolean isFirewallEvasion() { return firewallEvasion; }
    public void setFirewallEvasion(boolean firewallEvasion) { this.firewallEvasion = firewallEvasion; }
    
    public boolean isSslTest() { return sslTest; }
    public void setSslTest(boolean sslTest) { this.sslTest = sslTest; }
    
    public boolean isBruteForceCheck() { return bruteForceCheck; }
    public void setBruteForceCheck(boolean bruteForceCheck) { this.bruteForceCheck = bruteForceCheck; }
    
    public boolean isUdpScan() { return udpScan; }
    public void setUdpScan(boolean udpScan) { this.udpScan = udpScan; }
    
    public String getCustomPorts() { return customPorts; }
    public void setCustomPorts(String customPorts) { this.customPorts = customPorts; }
    
    public int getScanSpeed() { return scanSpeed; }
    public void setScanSpeed(int scanSpeed) { this.scanSpeed = scanSpeed; }
}

