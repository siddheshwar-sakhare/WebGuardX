package com.webguardx.app.controller;

import com.webguardx.app.model.ScanHistory;
import com.webguardx.app.model.ZapAlert;
import com.webguardx.app.repository.ScanHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/zap/analytics")
public class AnalyticsController {

    @Autowired
    private ScanHistoryRepository scanHistoryRepository;

    @GetMapping
    public Map<String, Object> getAnalytics(Authentication authentication) {
        String email = authentication.getName();
        List<ScanHistory> histories = scanHistoryRepository.findByUserEmail(email);

        Map<String, Object> response = new HashMap<>();

        response.put("totalScans", histories.size());

        // Count High, Medium, Low, Informational
        int high = 0, medium = 0, low = 0, info = 0;

        for (ScanHistory history : histories) {
            if (history.getAlerts() != null) {
                for (ZapAlert alert : history.getAlerts()) {
                    String risk = alert.getRisk();
                    if (risk != null) {
                        switch (risk.toLowerCase()) {
                            case "high": high++; break;
                            case "medium": medium++; break;
                            case "low": low++; break;
                            case "informational": info++; break;
                        }
                    }
                }
            }
        }

        Map<String, Integer> riskDistribution = new HashMap<>();
        riskDistribution.put("High", high);
        riskDistribution.put("Medium", medium);
        riskDistribution.put("Low", low);
        riskDistribution.put("Informational", info);

        response.put("riskDistribution", riskDistribution);

        // Scan timeline (last 10 scans by date for example)
        List<Map<String, Object>> timeline = histories.stream()
            .sorted((a, b) -> b.getScannedAt().compareTo(a.getScannedAt()))
            .limit(10)
            .map(h -> {
                Map<String, Object> point = new HashMap<>();
                point.put("date", h.getScannedAt().toString());
                point.put("url", h.getTargetUrl());
                point.put("alertsCount", h.getAlerts() != null ? h.getAlerts().size() : 0);
                return point;
            })
            .collect(Collectors.toList());

        response.put("timeline", timeline);

        return response;
    }
}
