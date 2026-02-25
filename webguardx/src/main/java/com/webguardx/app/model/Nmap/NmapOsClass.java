package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapOsClass {
    private String vendor;
    private String osFamily;
    private String osGen;
    private String type;
    private String accuracy;
    private List<String> cpe;
    
    // Getters and setters
    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    
    public String getOsFamily() { return osFamily; }
    public void setOsFamily(String osFamily) { this.osFamily = osFamily; }
    
    public String getOsGen() { return osGen; }
    public void setOsGen(String osGen) { this.osGen = osGen; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getAccuracy() { return accuracy; }
    public void setAccuracy(String accuracy) { this.accuracy = accuracy; }
    
    public List<String> getCpe() { return cpe; }
    public void setCpe(List<String> cpe) { this.cpe = cpe; }
}
