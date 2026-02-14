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

}
