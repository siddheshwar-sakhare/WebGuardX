package com.webguardx.app.model.Nmap;

public class NmapServiceInfo {
    private String name;
    private int port;
    private String protocol;
    private String product;
    private String version;
    private String ostype;
    private String extrainfo;
    private String method;
    private double cpe;
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getOstype() { return ostype; }
    public void setOstype(String ostype) { this.ostype = ostype; }
    
    public String getExtrainfo() { return extrainfo; }
    public void setExtrainfo(String extrainfo) { this.extrainfo = extrainfo; }
    
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    
    public double getCpe() { return cpe; }
    public void setCpe(double cpe) { this.cpe = cpe; }
}
