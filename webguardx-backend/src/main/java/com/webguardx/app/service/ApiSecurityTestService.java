package com.webguardx.app.service;

import com.webguardx.app.model.ApiEndpoint;
import com.webguardx.app.model.ApiTestResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApiSecurityTestService {

    private final RestTemplate restTemplate;

    @Autowired
    public ApiSecurityTestService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    public List<ApiTestResult> testAll(List<ApiEndpoint> endpoints, String baseUrl) {

        List<ApiTestResult> results = new ArrayList<>();
        
        if(baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length()-1);
        }

        for (ApiEndpoint ep : endpoints) {
            ApiTestResult result = new ApiTestResult();
            result.setEndpoint(ep.getPath());

            // 1. Test without auth
            boolean authBroken = testNoAuth(ep, baseUrl);
            result.setBrokenAuth(authBroken);

            // 2. Test data exposure
            boolean dataLeak = testDataExposure(ep, baseUrl);
            result.setDataExposure(dataLeak);

            // 3. Rate limit test
            boolean rateLimit = testRateLimit(ep, baseUrl);
            result.setRateLimited(rateLimit);
            
            // Calculate Risk
            result.setRiskLevel(calculateRisk(result));

            results.add(result);
        }

        return results;
    }

    private boolean testNoAuth(ApiEndpoint ep, String baseUrl) {
        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + ep.getPath(),
                    HttpMethod.valueOf(ep.getMethod()),
                    entity,
                    String.class
            );

            // If 200 OK -> authentication is broken (assuming it needed auth)
            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception e) {
            return false;
        }
    }

    private boolean testDataExposure(ApiEndpoint ep, String baseUrl) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + ep.getPath(),
                    HttpMethod.valueOf(ep.getMethod()),
                    null,
                    String.class
            );

            if (response.getBody() == null) return false;
            String body = response.getBody().toLowerCase();

            return body.contains("password") ||
                   body.contains("token") ||
                   body.contains("secret");
        } catch(Exception e) {
            return false;
        }
    }

    private boolean testRateLimit(ApiEndpoint ep, String baseUrl) {
        int successCount = 0;

        for (int i = 0; i < 20; i++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + ep.getPath(),
                    HttpMethod.valueOf(ep.getMethod()),
                    null,
                    String.class
                );

                if (response.getStatusCode().is2xxSuccessful()) {
                    successCount++;
                }

            } catch (Exception e) {
                break;
            }
        }

        // If all 20 succeed -> NO rate limiting
        return successCount == 20;
    }

    public boolean bruteForceTest(String email, String baseUrl) {
        String url = baseUrl + "/api/auth/login";

        for (int i = 0; i < 10; i++) {
            Map<String, String> body = new HashMap<>();
            body.put("email", email);
            body.put("password", "wrong" + i);

            try {
                ResponseEntity<String> response =
                        restTemplate.postForEntity(url, body, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    return false; // BAD: no protection
                }

            } catch (Exception e) {
                return true; // likely blocked or rate-limited
            }
        }

        return false; // no blocking detected
    }

    public String calculateRisk(ApiTestResult r) {
        int score = 0;

        if (r.isBrokenAuth()) score += 50;
        if (r.isDataExposure()) score += 30;
        if (r.isRateLimited()) score += 40;

        if (score > 70) return "CRITICAL";
        if (score > 40) return "HIGH";
        return "MEDIUM";
    }
}
