package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapOsDetection {
    private String name;
    private String accuracy;
    private String family;
    private String generation;
    private String vendor;
    private String osType;
    private List<String> cpe;
    private List<NmapOsClass> osClasses;
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAccuracy() { return accuracy; }
    public void setAccuracy(String accuracy) { this.accuracy = accuracy; }
    
    public String getFamily() { return family; }
    public void setFamily(String family) { this.family = family; }
    
    public String getGeneration() { return generation; }
    public void setGeneration(String generation) { this.generation = generation; }
    
    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }
    
    public String getOsType() { return osType; }
    public void setOsType(String osType) { this.osType = osType; }
    
    public List<String> getCpe() { return cpe; }
    public void setCpe(List<String> cpe) { this.cpe = cpe; }
    
    public List<NmapOsClass> getOsClasses() { return osClasses; }
    public void setOsClasses(List<NmapOsClass> osClasses) { this.osClasses = osClasses; }
}
