package com.webguardx.app.controller;

import com.webguardx.app.model.ApiEndpoint;
import com.webguardx.app.model.ApiScanRequest;
import com.webguardx.app.model.ApiTestResult;
import com.webguardx.app.service.ApiSecurityTestService;
import com.webguardx.app.service.OpenApiParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apiguard")
@CrossOrigin(origins = "*")
public class ApiSecurityController {

    private final OpenApiParserService openApiParserService;
    private final ApiSecurityTestService apiSecurityTestService;

    @Autowired
    public ApiSecurityController(OpenApiParserService openApiParserService,
                                 ApiSecurityTestService apiSecurityTestService) {
        this.openApiParserService = openApiParserService;
        this.apiSecurityTestService = apiSecurityTestService;
    }

    @PostMapping("/scan")
    public List<ApiTestResult> scanApi(@RequestBody ApiScanRequest request) {
        // 1. Fetch Endpoints
        List<ApiEndpoint> endpoints = openApiParserService.fetchEndpoints(request.getDocsUrl());
        
        if (endpoints.isEmpty()) {
            throw new RuntimeException("No endpoints found or invalid OpenAPI docs URL");
        }

        // 2. Test Endpoints
        return apiSecurityTestService.testAll(endpoints, request.getBaseUrl());
    }
}
