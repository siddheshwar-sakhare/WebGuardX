package com.webguardx.app.model;

public class ZapAlert {

    private String testName;
    private String risk;
    private String confidence;
    private String description;
    private String solution;
    private String url;

    public ZapAlert() {}

    public ZapAlert(String testName, String risk, String confidence,
                    String description, String solution, String url) {
        this.testName = testName;
        this.risk = risk;
        this.confidence = confidence;
        this.description = description;
        this.solution = solution;
        this.url = url;
    }

    public String getTestName() {
        return testName;
    }

    public String getRisk() {
        return risk;
    }

    public String getConfidence() {
        return confidence;
    }

    public String getDescription() {
        return description;
    }

    public String getSolution() {
        return solution;
    }

    public String getUrl() {
        return url;
    }
}
