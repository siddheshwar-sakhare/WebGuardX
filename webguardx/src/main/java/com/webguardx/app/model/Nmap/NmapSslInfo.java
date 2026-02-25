package com.webguardx.app.model.Nmap;

import java.util.List;

public class NmapSslInfo {
    private String certificateIssuer;
    private String certificateSubject;
    private String certificateExpiry;
    private String certificateVersion;
    private String certificateSerial;
    private List<String> supportedProtocols;
    private List<String> weakCiphers;
    private List<String> secureCiphers;
    private boolean selfSigned;
    private boolean expired;
    private boolean heartbleedVulnerable;
    private boolean poodleVulnerable;
    private boolean beastVulnerable;
    private boolean crimeVulnerable;
    private boolean freakVulnerable;
    private boolean logjamVulnerable;
    private boolean rc4Supported;
    private boolean tls1_0Supported;
    private boolean tls1_1Supported;
    private boolean tls1_2Supported;
    private boolean tls1_3Supported;
    private boolean ssl2Supported;
    private boolean ssl3Supported;
    
    // Getters and setters
    public String getCertificateIssuer() { return certificateIssuer; }
    public void setCertificateIssuer(String certificateIssuer) { this.certificateIssuer = certificateIssuer; }
    
    public String getCertificateSubject() { return certificateSubject; }
    public void setCertificateSubject(String certificateSubject) { this.certificateSubject = certificateSubject; }
    
    public String getCertificateExpiry() { return certificateExpiry; }
    public void setCertificateExpiry(String certificateExpiry) { this.certificateExpiry = certificateExpiry; }
    
    public String getCertificateVersion() { return certificateVersion; }
    public void setCertificateVersion(String certificateVersion) { this.certificateVersion = certificateVersion; }
    
    public String getCertificateSerial() { return certificateSerial; }
    public void setCertificateSerial(String certificateSerial) { this.certificateSerial = certificateSerial; }
    
    public List<String> getSupportedProtocols() { return supportedProtocols; }
    public void setSupportedProtocols(List<String> supportedProtocols) { this.supportedProtocols = supportedProtocols; }
    
    public List<String> getWeakCiphers() { return weakCiphers; }
    public void setWeakCiphers(List<String> weakCiphers) { this.weakCiphers = weakCiphers; }
    
    public List<String> getSecureCiphers() { return secureCiphers; }
    public void setSecureCiphers(List<String> secureCiphers) { this.secureCiphers = secureCiphers; }
    
    public boolean isSelfSigned() { return selfSigned; }
    public void setSelfSigned(boolean selfSigned) { this.selfSigned = selfSigned; }
    
    public boolean isExpired() { return expired; }
    public void setExpired(boolean expired) { this.expired = expired; }
    
    public boolean isHeartbleedVulnerable() { return heartbleedVulnerable; }
    public void setHeartbleedVulnerable(boolean heartbleedVulnerable) { this.heartbleedVulnerable = heartbleedVulnerable; }
    
    public boolean isPoodleVulnerable() { return poodleVulnerable; }
    public void setPoodleVulnerable(boolean poodleVulnerable) { this.poodleVulnerable = poodleVulnerable; }
    
    public boolean isBeastVulnerable() { return beastVulnerable; }
    public void setBeastVulnerable(boolean beastVulnerable) { this.beastVulnerable = beastVulnerable; }
    
    public boolean isCrimeVulnerable() { return crimeVulnerable; }
    public void setCrimeVulnerable(boolean crimeVulnerable) { this.crimeVulnerable = crimeVulnerable; }
    
    public boolean isFreakVulnerable() { return freakVulnerable; }
    public void setFreakVulnerable(boolean freakVulnerable) { this.freakVulnerable = freakVulnerable; }
    
    public boolean isLogjamVulnerable() { return logjamVulnerable; }
    public void setLogjamVulnerable(boolean logjamVulnerable) { this.logjamVulnerable = logjamVulnerable; }
    
    public boolean isRc4Supported() { return rc4Supported; }
    public void setRc4Supported(boolean rc4Supported) { this.rc4Supported = rc4Supported; }
    
    public boolean isTls1_0Supported() { return tls1_0Supported; }
    public void setTls1_0Supported(boolean tls1_0Supported) { this.tls1_0Supported = tls1_0Supported; }
    
    public boolean isTls1_1Supported() { return tls1_1Supported; }
    public void setTls1_1Supported(boolean tls1_1Supported) { this.tls1_1Supported = tls1_1Supported; }
    
    public boolean isTls1_2Supported() { return tls1_2Supported; }
    public void setTls1_2Supported(boolean tls1_2Supported) { this.tls1_2Supported = tls1_2Supported; }
    
    public boolean isTls1_3Supported() { return tls1_3Supported; }
    public void setTls1_3Supported(boolean tls1_3Supported) { this.tls1_3Supported = tls1_3Supported; }
    
    public boolean isSsl2Supported() { return ssl2Supported; }
    public void setSsl2Supported(boolean ssl2Supported) { this.ssl2Supported = ssl2Supported; }
    
    public boolean isSsl3Supported() { return ssl3Supported; }
    public void setSsl3Supported(boolean ssl3Supported) { this.ssl3Supported = ssl3Supported; }
}
