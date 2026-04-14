package com.webguardx.app.controller;

import com.webguardx.app.model.ScanRequest;
import com.webguardx.app.model.ScanResult;
import com.webguardx.app.model.User;
import com.webguardx.app.repository.UserRepository;
import com.webguardx.app.service.ZapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/zap")
public class ZapController {

    @Autowired
    private ZapService zapService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.webguardx.app.repository.ScanHistoryRepository scanHistoryRepository;

    @PostMapping("/scan")

    public ScanResult scan(
            @RequestBody ScanRequest request,
            Authentication authentication) {

        System.out.println("********************************************************");

        // 👇 USER COMES FROM JWT (Google OAuth login)
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println(email + " *******************************************************");

        // ✅ TAKE VALUES FROM REQUEST BODY
        return zapService.scan(
                request.getUrl(),
                request.isActiveScan(),
                user
        );
    }
    @GetMapping("/history")
    public java.util.List<com.webguardx.app.model.ScanHistory> getHistory(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).map(user -> scanHistoryRepository.findByUserEmail(user.getEmail())).orElse(java.util.Collections.emptyList());
    }

    @Autowired
    private com.webguardx.app.repository.ScheduledScanRepository scheduledScanRepository;

    @PostMapping("/schedule")
    public org.springframework.http.ResponseEntity<?> scheduleScan(
            @RequestBody java.util.Map<String, Object> request,
            Authentication authentication) {
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        String url = (String) request.get("url");
        boolean activeScan = (boolean) request.get("activeScan");
        String scheduleType = (String) request.get("scheduleType"); 

        com.webguardx.app.model.ScheduledScan scheduledScan = new com.webguardx.app.model.ScheduledScan();
        scheduledScan.setUserId(user.getId());
        scheduledScan.setUserEmail(user.getEmail());
        scheduledScan.setTargetUrl(url);
        scheduledScan.setActiveScan(activeScan);
        scheduledScan.setScheduleType(scheduleType);
        scheduledScan.setNextRunTime(java.time.LocalDateTime.now().plusHours(1)); 

        scheduledScanRepository.save(scheduledScan);

        return org.springframework.http.ResponseEntity.ok("Scan scheduled successfully.");
    }
}
