package com.webguardx.ssl.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "ssl_scans")
public class SslScanResult {
    @Id
    private String id;
    private String userId;
    private String userEmail;
    private String hostname;
    private int port;
    private Instant scannedAt;
    private String grade;
    private int score;
    private List<CertInfo> chain;
    private List<CipherSuite> ciphers;
    private List<String> protocols;
    private HstsInfo hsts;
    private boolean ctLogged;
    private String ctLogStatus;  // "LOGGED" | "NOT_FOUND" | "UNAVAILABLE"
    private List<String> caaRecords;
    private List<String> warnings;

    public SslScanResult() {}

    public SslScanResult(String id, String userId, String userEmail, String hostname, int port, Instant scannedAt, String grade, int score, List<CertInfo> chain, List<CipherSuite> ciphers, List<String> protocols, HstsInfo hsts, boolean ctLogged, String ctLogStatus, List<String> caaRecords, List<String> warnings) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.hostname = hostname;
        this.port = port;
        this.scannedAt = scannedAt;
        this.grade = grade;
        this.score = score;
        this.chain = chain;
        this.ciphers = ciphers;
        this.protocols = protocols;
        this.hsts = hsts;
        this.ctLogged = ctLogged;
        this.ctLogStatus = ctLogStatus;
        this.caaRecords = caaRecords;
        this.warnings = warnings;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public Instant getScannedAt() { return scannedAt; }
    public void setScannedAt(Instant scannedAt) { this.scannedAt = scannedAt; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public List<CertInfo> getChain() { return chain; }
    public void setChain(List<CertInfo> chain) { this.chain = chain; }
    public List<CipherSuite> getCiphers() { return ciphers; }
    public void setCiphers(List<CipherSuite> ciphers) { this.ciphers = ciphers; }
    public List<String> getProtocols() { return protocols; }
    public void setProtocols(List<String> protocols) { this.protocols = protocols; }
    public HstsInfo getHsts() { return hsts; }
    public void setHsts(HstsInfo hsts) { this.hsts = hsts; }
    public boolean isCtLogged() { return ctLogged; }
    public void setCtLogged(boolean ctLogged) { this.ctLogged = ctLogged; }
    public String getCtLogStatus() { return ctLogStatus; }
    public void setCtLogStatus(String ctLogStatus) { this.ctLogStatus = ctLogStatus; }
    public List<String> getCaaRecords() { return caaRecords; }
    public void setCaaRecords(List<String> caaRecords) { this.caaRecords = caaRecords; }
    public List<String> getWarnings() { return warnings; }
    public void setWarnings(List<String> warnings) { this.warnings = warnings; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String userEmail;
        private String hostname;
        private int port;
        private Instant scannedAt;
        private String grade;
        private int score;
        private List<CertInfo> chain;
        private List<CipherSuite> ciphers;
        private List<String> protocols;
        private HstsInfo hsts;
        private boolean ctLogged;
        private String ctLogStatus;
        private List<String> caaRecords;
        private List<String> warnings;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public Builder hostname(String hostname) { this.hostname = hostname; return this; }
        public Builder port(int port) { this.port = port; return this; }
        public Builder scannedAt(Instant scannedAt) { this.scannedAt = scannedAt; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }
        public Builder score(int score) { this.score = score; return this; }
        public Builder chain(List<CertInfo> chain) { this.chain = chain; return this; }
        public Builder ciphers(List<CipherSuite> ciphers) { this.ciphers = ciphers; return this; }
        public Builder protocols(List<String> protocols) { this.protocols = protocols; return this; }
        public Builder hsts(HstsInfo hsts) { this.hsts = hsts; return this; }
        public Builder ctLogged(boolean ctLogged) { this.ctLogged = ctLogged; return this; }
        public Builder ctLogStatus(String ctLogStatus) { this.ctLogStatus = ctLogStatus; return this; }
        public Builder caaRecords(List<String> caaRecords) { this.caaRecords = caaRecords; return this; }
        public Builder warnings(List<String> warnings) { this.warnings = warnings; return this; }

        public SslScanResult build() {
            return new SslScanResult(id, userId, userEmail, hostname, port, scannedAt, grade, score, chain, ciphers, protocols, hsts, ctLogged, ctLogStatus, caaRecords, warnings);
        }
    }
}
