package com.webguardx.app.controller.Nmap;


import com.webguardx.app.model.Nmap.NmapScanRequest;
import com.webguardx.app.model.Nmap.NmapScanResult;
import com.webguardx.app.model.User;
import com.webguardx.app.repository.UserRepository;
import com.webguardx.app.service.Nmap.NmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/nmap")
public class NmapController {

    @Autowired
    private NmapService nmapService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/scan")
    public NmapScanResult scan(
            @RequestBody NmapScanRequest request,
            Authentication authentication) {

        System.out.println("********************************************************");
        
        // User comes from JWT (Google OAuth login)
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println(email + " requested Nmap scan for: " + request.getTarget());
        System.out.println("Scan options - OS Detection: " + request.isOsDetection() +
                          ", Version Detection: " + request.isVersionDetection() +
                          ", Vulnerability Scan: " + request.isVulnerabilityScan() +
                          ", SSL Test: " + request.isSslTest() +
                          ", Firewall Evasion: " + request.isFirewallEvasion());

        // Execute Nmap scan
        return nmapService.scan(request, user);
    }

    @GetMapping("/features")
    public FeaturesResponse getFeatures() {
        return new FeaturesResponse();
    }

    static class FeaturesResponse {
        private final List<String> features = Arrays.asList(
            "Open Port Detection",
            "Closed / Filtered Port Detection",
            "Service & Version Detection",
            "OS Detection",
            "Firewall & IDS Detection",
            "Device Discovery on Network",
            "Vulnerability Scanning using NSE Scripts",
            "SSL/TLS Security Testing",
            "Weak Encryption Detection",
            "Brute-Force Risk Detection",
            "Exposed Database Port Detection",
            "Server Misconfiguration Detection",
            "CVE Detection via Vulnerability Scripts",
            "DoS Risk Detection",
            "Anonymous FTP Detection",
            "SMB Vulnerability Detection",
            "Cloud Server Exposure Detection"
        );

        public List<String> getFeatures() {
            return features;
        }
    }
}