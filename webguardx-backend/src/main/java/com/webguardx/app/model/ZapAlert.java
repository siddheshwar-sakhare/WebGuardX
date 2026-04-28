package com.webguardx.app.model;

public class ZapAlert {

    private String testName;
    private String risk;
    private String confidence;
    private String description;
    private String solution;
    private String url;
    private double aiScore;
    private String priority;
    private String reasoning;
    private boolean exploitable;
    private String evidence;
    private String param;
    private String attack;
    private String otherInfo;
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

    public double getAiScore() {
        return aiScore;
    }

    public void setAiScore(double aiScore) {
        this.aiScore = aiScore;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getReasoning() {
        return reasoning;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public boolean isExploitable() {
        return exploitable;
    }

    public void setExploitable(boolean exploitable) {
        this.exploitable = exploitable;
    }

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public String getAttack() {
        return attack;
    }

    public void setAttack(String attack) {
        this.attack = attack;
    }

    public String getOtherInfo() {
        return otherInfo;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }
}
