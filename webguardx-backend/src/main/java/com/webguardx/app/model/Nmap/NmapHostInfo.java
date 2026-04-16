package com.webguardx.app.model.Nmap;

public class NmapHostInfo {
    private String ipAddress;
    private String hostname;
    private String macAddress;
    private String vendor;
    private String status;
    private double uptime;
    private long latency;
    private int totalPorts;
    private int openPorts;
    private int filteredPorts;
    private int closedPorts;
    
    // Getters and setters
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    
    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    
    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public double getUptime() { return uptime; }
    public void setUptime(double uptime) { this.uptime = uptime; }
    
    public long getLatency() { return latency; }
    public void setLatency(long latency) { this.latency = latency; }
    
    public int getTotalPorts() { return totalPorts; }
    public void setTotalPorts(int totalPorts) { this.totalPorts = totalPorts; }
    
    public int getOpenPorts() { return openPorts; }
    public void setOpenPorts(int openPorts) { this.openPorts = openPorts; }
    
    public int getFilteredPorts() { return filteredPorts; }
    public void setFilteredPorts(int filteredPorts) { this.filteredPorts = filteredPorts; }
    
    public int getClosedPorts() { return closedPorts; }
    public void setClosedPorts(int closedPorts) { this.closedPorts = closedPorts; }
}
