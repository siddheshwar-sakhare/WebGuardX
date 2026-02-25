package com.webguardx.app.model.Nmap;

public class NmapFilteredPort {
    private int port;
    private String protocol;
    private String filterType;
    private String reason;
    
    // Getters and setters
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    
    public String getFilterType() { return filterType; }
    public void setFilterType(String filterType) { this.filterType = filterType; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
