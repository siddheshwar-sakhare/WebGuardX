package com.webguardx.app.service;

import com.webguardx.app.model.ApiEndpoint;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OpenApiParserService {

    public List<ApiEndpoint> fetchEndpoints(String docsUrl) {
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            Map<String, Object> doc = restTemplate.getForObject(docsUrl, Map.class);
            if (doc == null || !doc.containsKey("paths")) {
                return new ArrayList<>();
            }

            Map<String, Object> paths = (Map<String, Object>) doc.get("paths");
            List<ApiEndpoint> endpoints = new ArrayList<>();

            for (String path : paths.keySet()) {
                Map<String, Object> methods = (Map<String, Object>) paths.get(path);

                for (String method : methods.keySet()) {
                    ApiEndpoint ep = new ApiEndpoint();
                    ep.setPath(path);
                    ep.setMethod(method.toUpperCase());
                    endpoints.add(ep);
                }
            }
            return endpoints;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
