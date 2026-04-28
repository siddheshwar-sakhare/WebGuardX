package com.webguardx.ssl;

public class SslScanRequest {
    private String hostname;
    private int port;

    public SslScanRequest() {}

    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
}
