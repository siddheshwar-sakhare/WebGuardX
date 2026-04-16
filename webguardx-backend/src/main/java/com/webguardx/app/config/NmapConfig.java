package com.webguardx.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NmapConfig {
    
    @Value("${nmap.path:/usr/bin/nmap}")
    private String nmapPath;
    
    @Value("${nmap.sudo.password:}")
    private String sudoPassword;
    
    @Value("${nmap.scan.timeout:600000}")
    private int scanTimeout;
    
    @Value("${nmax.thread.pool.size:5}")
    private int threadPoolSize;
    
    public String getNmapPath() {
        return nmapPath;
    }
    
    public String getSudoPassword() {
        return sudoPassword;
    }
    
    public int getScanTimeout() {
        return scanTimeout;
    }
    
    public int getThreadPoolSize() {
        return threadPoolSize;
    }
}