package com.webguardx.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.webguardx.app.model.ZapAlert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RiskScoringService {

    private static final Logger logger = LoggerFactory.getLogger(RiskScoringService.class);

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void enrichAlert(ZapAlert alert) {
        // Try Gemini AI first if key exists
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            boolean success = applyGeminiAI(alert);
            if (success) {
                return; // Successfully enriched via AI
            }
        }

        // Fallback to Rule-Based Engine
        applyRuleBasedScoring(alert);
    }

    private void applyRuleBasedScoring(ZapAlert alert) {
        double score = calculateBaseScore(alert);
        alert.setAiScore(score);
        alert.setPriority(getPriority(score));
        alert.setExploitable(isExploitableRuleBased(alert));
        alert.setReasoning(generateReasoningRuleBased(alert, score));
    }

    private double calculateBaseScore(ZapAlert alert) {
        double score = 0;

        // Base risk
        if (alert.getRisk() != null) {
            switch (alert.getRisk()) {
                case "High": score += 50; break;
                case "Medium": score += 30; break;
                case "Low": score += 10; break;
            }
        }

        // Confidence weight
        if ("High".equals(alert.getConfidence())) {
            score += 20;
        }

        // Sensitive endpoints
        if (alert.getUrl() != null) {
            String urlLower = alert.getUrl().toLowerCase();
            if (urlLower.contains("login") || urlLower.contains("admin") || urlLower.contains("auth") || urlLower.contains("dashboard")) {
                score += 25;
            }
        }

        // Data exposure keywords
        if (alert.getDescription() != null) {
            String descLower = alert.getDescription().toLowerCase();
            if (descLower.contains("cookie") || descLower.contains("token") || descLower.contains("password") || descLower.contains("credential") || descLower.contains("sql")) {
                score += 20;
            }
        }

        // Cap score at 100
        return Math.min(score, 100);
    }

    private String getPriority(double score) {
        if (score >= 80) return "CRITICAL";
        if (score >= 60) return "HIGH";
        if (score >= 40) return "MEDIUM";
        return "LOW";
    }

    private boolean isExploitableRuleBased(ZapAlert alert) {
        return "High".equals(alert.getRisk()) && "High".equals(alert.getConfidence());
    }

    private String generateReasoningRuleBased(ZapAlert alert, double score) {
        if (score >= 80) {
            return "High-risk vulnerability detected on a sensitive endpoint with strong potential for data exposure.";
        } else if (score >= 60) {
            return "Significant vulnerability with reliable exploitability characteristics.";
        } else if (score >= 40) {
            return "Moderate risk issue; might require chained vulnerabilities to fully exploit.";
        }
        return "Low risk finding or informational metric with limited direct exploitability.";
    }

    private boolean applyGeminiAI(ZapAlert alert) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            String prompt = String.format(
                "You are an expert cybersecurity analyst. Analyze this web vulnerability and score the risk context from 1 to 100.\n\n" +
                "Vulnerability Name: %s\n" +
                "URL: %s\n" +
                "Base ZAP Risk: %s\n" +
                "Confidence: %s\n" +
                "Description: %s\n\n" +
                "Respond ONLY with a valid JSON format having these exact 4 keys: 'aiScore' (number 0-100), 'priority' (string: CRITICAL, HIGH, MEDIUM, LOW), 'exploitable' (boolean), and 'reasoning' (string 1-2 sentences). Do not include markdown code blocks like ```json.",
                alert.getTestName(), alert.getUrl(), alert.getRisk(), alert.getConfidence(), alert.getDescription()
            );

            ObjectNode content = objectMapper.createObjectNode();
            ArrayNode parts = objectMapper.createArrayNode();
            ObjectNode part = objectMapper.createObjectNode();
            part.put("text", prompt);
            parts.add(part);
            content.set("parts", parts);
            
            ArrayNode contents = objectMapper.createArrayNode();
            contents.add(content);

            ObjectNode bodyNode = objectMapper.createObjectNode();
            bodyNode.set("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(bodyNode), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                
                if (!textNode.isMissingNode()) {
                    String aiResponseText = textNode.asText().trim();
                    // Clean possible markdown formatting
                    if (aiResponseText.startsWith("```json")) {
                        aiResponseText = aiResponseText.substring(7);
                        if (aiResponseText.endsWith("```")) {
                            aiResponseText = aiResponseText.substring(0, aiResponseText.length() - 3);
                        }
                    } else if (aiResponseText.startsWith("```")) {
                        aiResponseText = aiResponseText.substring(3);
                        if (aiResponseText.endsWith("```")) {
                            aiResponseText = aiResponseText.substring(0, aiResponseText.length() - 3);
                        }
                    }

                    JsonNode aiResult = objectMapper.readTree(aiResponseText);
                    
                    alert.setAiScore(aiResult.path("aiScore").asDouble());
                    alert.setPriority(aiResult.path("priority").asText());
                    alert.setExploitable(aiResult.path("exploitable").asBoolean());
                    alert.setReasoning(aiResult.path("reasoning").asText());
                    logger.info("Gemini AI successfully scored vulnerability: {}", alert.getTestName());
                    return true;
                }
            }
            logger.warn("Gemini AI returned non-200 status or invalid structure. Falling back to rule-based engine.");
        } catch (Exception e) {
            logger.error("Error communicating with Gemini API: {}. Falling back to rule-based engine.", e.getMessage());
        }
        return false;
    }
}
