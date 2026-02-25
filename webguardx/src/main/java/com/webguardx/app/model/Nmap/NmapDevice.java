package com.webguardx.app.model.Nmap;

public class NmapDevice {
    private String ipAddress;
    private String macAddress;
    private String vendor;
    private String hostname;
    private int openPorts;
    private String deviceType;
    private String status;
    private long latency;
    
    // Getters and setters
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    
    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    
    public int getOpenPorts() { return openPorts; }
    public void setOpenPorts(int openPorts) { this.openPorts = openPorts; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public long getLatency() { return latency; }
    public void setLatency(long latency) { this.latency = latency; }
}
