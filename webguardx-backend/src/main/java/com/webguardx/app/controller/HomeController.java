package com.webguardx.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to WebGuardX";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Login Successful!";
    }
}
