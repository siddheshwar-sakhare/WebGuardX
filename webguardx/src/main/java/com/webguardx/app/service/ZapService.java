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

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


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


    public ScanResult scan(String targetUrl, boolean activeScan, User user) {

        // Validate input
        if (targetUrl == null || targetUrl.trim().isEmpty()) {
            logger.error("Target URL is null or empty");
            return new ScanResult("ERROR: Target URL cannot be null or empty", new ArrayList<>());
        }

        // Validate ZAP configuration
        if (zapConfig.getApiKey() == null || zapConfig.getApiKey().trim().isEmpty()) {
            logger.error("ZAP API key is not configured");
            return new ScanResult("ERROR: ZAP API key not configured in application.properties", new ArrayList<>());
        }

        HttpURLConnection conn = null;

        try {
            String base = "http://" + zapConfig.getHost() + ":" + zapConfig.getPort();
            String apiKey = zapConfig.getApiKey();

            // Clean and encode the target URL
            targetUrl = targetUrl.trim();
            if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
                targetUrl = "http://" + targetUrl;
            }

            String encodedTargetUrl = URLEncoder.encode(targetUrl, StandardCharsets.UTF_8);
            logger.info("Starting ZAP scan for URL: {}", targetUrl);
            logger.info("ZAP API URL: {}", base);

            // Step 1: Test ZAP connection first
            try {
                URL testUrl = new URL(base + "/JSON/core/view/version/?apikey=" + apiKey);
                HttpURLConnection testConn = (HttpURLConnection) testUrl.openConnection();
                testConn.setRequestMethod("GET");
                testConn.setConnectTimeout(5000);
                testConn.setReadTimeout(5000);

                int responseCode = testConn.getResponseCode();
                if (responseCode != 200) {
                    logger.error("ZAP connection test failed with response code: {}", responseCode);
                    return new ScanResult("ERROR: Cannot connect to ZAP. Make sure ZAP is running on " + base, new ArrayList<>());
                }

                ObjectMapper testMapper = new ObjectMapper();
                JsonNode testRoot = testMapper.readTree(testConn.getInputStream());
                logger.info("✅ Connected to ZAP version: {}", testRoot.path("version").asText("unknown"));
                testConn.disconnect();
            } catch (Exception e) {
                logger.error("Failed to connect to ZAP: {}", e.getMessage());
                return new ScanResult("ERROR: Cannot connect to ZAP. Please start ZAP first. Details: " + e.getMessage(), new ArrayList<>());
            }

            // Step 2: Spider scan
            // Step 2: Spider scan with correct Content-Type
            logger.info("Starting spider scan for URL: {}", targetUrl);

// Create connection
            URL spiderUrl = new URL(base + "/JSON/spider/action/scan/");
            conn = (HttpURLConnection) spiderUrl.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setDoOutput(true); // This is crucial for sending POST data
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(60000);

// Build the POST data in the format the ZAP API expects
            String postData = "url=" + encodedTargetUrl +
                    "&apikey=" + apiKey +
                    "&maxChildren=5&recurse=true&contextName=&maxDuration=0";

// Write the data to the connection
            try (java.io.OutputStream os = conn.getOutputStream()) {
                byte[] input = postData.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int spiderResponseCode = conn.getResponseCode();
            if (spiderResponseCode != 200) {
                // Read the error stream to understand why it failed
                try (InputStream errorStream = conn.getErrorStream()) {
                    if (errorStream != null) {
                        ObjectMapper errorMapper = new ObjectMapper();
                        JsonNode errorJson = errorMapper.readTree(errorStream);
                        String errorMessage = errorJson.path("message").asText("Unknown error");
                        logger.error("Spider scan failed with code: {}, error: {}", spiderResponseCode, errorMessage);
                        return new ScanResult("ERROR: Spider scan failed - " + errorMessage, new ArrayList<>());
                    }
                }
                return new ScanResult("ERROR: Spider scan failed with HTTP " + spiderResponseCode, new ArrayList<>());
            }

// Don't forget to disconnect
            conn.disconnect();

            // Step 3: Active scan (if requested) - FIXED VERSION
            if (activeScan) {
                logger.info("Starting active scan...");

                URL ascanUrl = new URL(base + "/JSON/ascan/action/scan/");
                HttpURLConnection ascanConn = (HttpURLConnection) ascanUrl.openConnection();
                ascanConn.setRequestMethod("POST");
                ascanConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                ascanConn.setDoOutput(true);
                ascanConn.setConnectTimeout(15000);
                ascanConn.setReadTimeout(60000);

                // Build POST data for active scan
                String ascanPostData = "url=" + encodedTargetUrl +
                        "&apikey=" + apiKey +
                        "&recurse=true" +
                        "&inScopeOnly=false" +
                        "&scanPolicyName=" +
                        "&method=" +
                        "&postData=" +
                        "&contextId=";

                try (java.io.OutputStream os = ascanConn.getOutputStream()) {
                    byte[] input = ascanPostData.getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }

                int ascanResponseCode = ascanConn.getResponseCode();
                if (ascanResponseCode != 200) {
                    logger.error("Active scan failed with response code: {}", ascanResponseCode);
                    // Read error stream for details
                    try (InputStream errorStream = ascanConn.getErrorStream()) {
                        if (errorStream != null) {
                            ObjectMapper errorMapper = new ObjectMapper();
                            JsonNode errorJson = errorMapper.readTree(errorStream);
                            logger.error("Active scan error: {}", errorJson.toString());
                        }
                    }
                } else {
                    logger.info("Active scan started successfully");
                }
                ascanConn.disconnect();
            }

            // Step 4: Get alerts
            logger.info("Retrieving alerts...");
            URL alertsUrl = new URL(base + "/JSON/core/view/alerts/?baseurl=" + encodedTargetUrl + "&apikey=" + apiKey);
            conn = (HttpURLConnection) alertsUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(30000);

            int alertsResponseCode = conn.getResponseCode();
            if (alertsResponseCode != 200) {
                logger.error("Failed to get alerts. Response code: {}", alertsResponseCode);
                return new ScanResult("ERROR: Failed to retrieve alerts from ZAP", new ArrayList<>());
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(conn.getInputStream());
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
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }
}