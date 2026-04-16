package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapPort {
    private int port;
    private String protocol;
    private String state;
    private String service;
    private String version;
    private String product;
    private String extraInfo;
    private String reason;
    private double cpe;
    private List<String> scripts;
    
    // Getters and setters
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    
    public String getExtraInfo() { return extraInfo; }
    public void setExtraInfo(String extraInfo) { this.extraInfo = extraInfo; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public double getCpe() { return cpe; }
    public void setCpe(double cpe) { this.cpe = cpe; }
    
    public List<String> getScripts() { return scripts; }
    public void setScripts(List<String> scripts) { this.scripts = scripts; }
}
