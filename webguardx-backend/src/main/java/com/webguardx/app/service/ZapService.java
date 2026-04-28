package com.webguardx.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webguardx.app.config.ZapConfig;
import com.webguardx.app.model.ScanResult;
import com.webguardx.app.model.User;
import com.webguardx.app.model.ZapAlert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.client.RestTemplate;


import com.webguardx.app.repository.ScanHistoryRepository;
import com.webguardx.app.model.ScanHistory;
import org.springframework.security.core.context.SecurityContextHolder;



@Service
public class ZapService {

    private static final Logger logger = LoggerFactory.getLogger(ZapService.class);

    @Autowired
    private ZapConfig zapConfig;

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @Autowired
    private RiskScoringService riskScoringService;


    public ScanResult scan(String targetUrl, boolean activeScan, User user) {


        if (targetUrl == null || targetUrl.trim().isEmpty()) {
            logger.error("Target URL is null or empty");
            return new ScanResult("ERROR: Target URL cannot be null or empty", new ArrayList<>());
        }

        // Validate ZAP configuration
        if (zapConfig.getApiKey() == null || zapConfig.getApiKey().trim().isEmpty()) {
            logger.error("ZAP API key is not configured");
            return new ScanResult("ERROR: ZAP API key not configured in application.properties", new ArrayList<>());
        }

        try {
            String base = "http://" + zapConfig.getHost() + ":" + zapConfig.getPort();
            String apiKey = zapConfig.getApiKey();

            // Clean and encode the target URL
            targetUrl = targetUrl.trim();
            if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
                targetUrl = "http://" + targetUrl;
            }

            // Use the raw targetUrl, RestTemplate URI variables will encode it correctly.
            logger.info("Starting ZAP scan for URL: {}", targetUrl);
            logger.info("ZAP API URL: {}", base);

            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            // Step 1: Test ZAP connection first
            try {
                String testUrl = base + "/JSON/core/view/version/?apikey=" + apiKey;
                String testResponse = restTemplate.getForObject(testUrl, String.class);
                JsonNode testRoot = mapper.readTree(testResponse);
                logger.info("✅ Connected to ZAP version: {}", testRoot.path("version").asText("unknown"));
            } catch (Exception e) {
                logger.error("Failed to connect to ZAP: {}", e.getMessage());
                return new ScanResult("ERROR: Cannot connect to ZAP. Please start ZAP first.", new ArrayList<>());
            }

            // Increase scan strength (Optional improvement)
            try {
                restTemplate.getForObject(base + "/JSON/ascan/action/setOptionAttackStrength/?Integer=HIGH&apikey={apikey}", String.class, apiKey);
                restTemplate.getForObject(base + "/JSON/ascan/action/setOptionAlertThreshold/?Integer=LOW&apikey={apikey}", String.class, apiKey);
            } catch (Exception e) {
                logger.warn("Failed to set options (ZAP versions may vary). Continuing...");
            }

            // Step 2: Spider scan
            logger.info("Starting spider scan for URL: {}", targetUrl);

            String spiderUrl = base + "/JSON/spider/action/scan/?url={url}&apikey={apikey}&maxChildren=5&recurse=true";
            String spiderRes = restTemplate.getForObject(spiderUrl, String.class, targetUrl, apiKey);

            JsonNode spiderResNode = mapper.readTree(spiderRes);
            String spiderScanId = spiderResNode.path("scan").asText();

            if (spiderScanId == null || spiderScanId.isEmpty()) {
                logger.error("Spider scan failed. Response: {}", spiderRes);
                throw new RuntimeException("Failed to start spider scan: " + spiderRes);
            }

            logger.info("Spider scan started with ID: {}", spiderScanId);

            // Wait for spider
            while (true) {
                String statusUrl = base + "/JSON/spider/view/status/?scanId={scanId}&apikey={apikey}";
                String statusRes = restTemplate.getForObject(statusUrl, String.class, spiderScanId, apiKey);
                int progress = mapper.readTree(statusRes).path("status").asInt(0);
                
                logger.info("Spider progress: {}%", progress);
                if (progress >= 100) break;
                
                Thread.sleep(3000); // Wait 3 seconds
            }
            
            // FINAL BUFFER (critical)
            Thread.sleep(2000);

            // Step 3: Active scan (if requested)
            if (activeScan) {
                logger.info("Spider done, starting active scan...");
                String activeUrl = base + "/JSON/ascan/action/scan/?url={url}&apikey={apikey}&recurse=true";
                String activeRes = restTemplate.getForObject(activeUrl, String.class, targetUrl, apiKey);
                String activeScanId = mapper.readTree(activeRes).path("scan").asText();

                // Wait for Active Scan
                while (true) {
                    String statusUrl = base + "/JSON/ascan/view/status/?scanId={scanId}&apikey={apikey}";
                    String statusRes = restTemplate.getForObject(statusUrl, String.class, activeScanId, apiKey);
                    int progress = mapper.readTree(statusRes).path("status").asInt(0);
                    
                    logger.info("Active scan progress: {}%", progress);
                    if (progress >= 100) break;
                    
                    Thread.sleep(5000); // Wait 5 seconds
                }
            }

            // Step 4: Get alerts
            logger.info("Retrieving alerts...");
            String alertsUrl = base + "/JSON/core/view/alerts/?baseurl={url}&apikey={apikey}";
            String alertsResponse = restTemplate.getForObject(alertsUrl, String.class, targetUrl, apiKey);
            JsonNode root = mapper.readTree(alertsResponse);
            JsonNode alerts = root.get("alerts");

            List<ZapAlert> results = new ArrayList<>();

            if (alerts != null && alerts.isArray()) {
                for (JsonNode alert : alerts) {
                    ZapAlert zapAlert = new ZapAlert(
                            alert.has("alert") ? alert.get("alert").asText() : "Unknown",
                            alert.has("risk") ? alert.get("risk").asText() : "Unknown",
                            alert.has("confidence") ? alert.get("confidence").asText() : "Unknown",
                            alert.has("description") ? alert.get("description").asText() : "",
                            alert.has("solution") ? alert.get("solution").asText() : "",
                            alert.has("url") ? alert.get("url").asText() : targetUrl
                    );
                    if (alert.has("evidence")) zapAlert.setEvidence(alert.get("evidence").asText());
                    if (alert.has("param")) zapAlert.setParam(alert.get("param").asText());
                    if (alert.has("attack")) zapAlert.setAttack(alert.get("attack").asText());
                    if (alert.has("other")) zapAlert.setOtherInfo(alert.get("other").asText());

                    riskScoringService.enrichAlert(zapAlert);
                    results.add(zapAlert);
                }
            }

            logger.info("Scan complete. Found {} alerts", results.size());
            ScanHistory history = new ScanHistory();
            history.setUserId(user.getId());
            history.setUserEmail(user.getEmail());
            history.setTargetUrl(targetUrl);
            history.setActiveScan(activeScan);
            history.setScannedAt(LocalDateTime.now());
            history.setStatus("SUCCESS");
            history.setAlerts(results);

            scanHistoryRepository.save(history);

            return new ScanResult("SUCCESS", results);

        } catch (Exception e) {
            logger.error("ZAP scan failed: {}", e.getMessage(), e);
            return new ScanResult("ERROR: " + e.getMessage(), new ArrayList<>());
        }
    }
}