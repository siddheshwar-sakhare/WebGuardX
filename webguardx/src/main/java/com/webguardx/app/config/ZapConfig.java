package com.webguardx.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ZapConfig {

    @Value("${zap.host:localhost}")
    private String host;

    @Value("${zap.port:8081}")
    private int port;

    @Value("${zap.api.key:}")
    private String apiKey;

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public String getApiKey() {
        return apiKey;
    }
}