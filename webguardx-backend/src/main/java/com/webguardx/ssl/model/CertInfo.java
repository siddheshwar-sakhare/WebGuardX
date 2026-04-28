package com.webguardx.ssl.model;

import java.time.Instant;
import java.util.List;

public class CertInfo {
    private String subject;
    private String issuer;
    private Instant notBefore;
    private Instant notAfter;
    private long daysRemaining;
    private List<String> sans;
    private String keyAlgorithm;
    private int keySize;
    private String signatureAlgorithm;
    private boolean isSelfSigned;

    public CertInfo() {}

    public CertInfo(String subject, String issuer, Instant notBefore, Instant notAfter, long daysRemaining, List<String> sans, String keyAlgorithm, int keySize, String signatureAlgorithm, boolean isSelfSigned) {
        this.subject = subject;
        this.issuer = issuer;
        this.notBefore = notBefore;
        this.notAfter = notAfter;
        this.daysRemaining = daysRemaining;
        this.sans = sans;
        this.keyAlgorithm = keyAlgorithm;
        this.keySize = keySize;
        this.signatureAlgorithm = signatureAlgorithm;
        this.isSelfSigned = isSelfSigned;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public Instant getNotBefore() { return notBefore; }
    public void setNotBefore(Instant notBefore) { this.notBefore = notBefore; }
    public Instant getNotAfter() { return notAfter; }
    public void setNotAfter(Instant notAfter) { this.notAfter = notAfter; }
    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }
    public List<String> getSans() { return sans; }
    public void setSans(List<String> sans) { this.sans = sans; }
    public String getKeyAlgorithm() { return keyAlgorithm; }
    public void setKeyAlgorithm(String keyAlgorithm) { this.keyAlgorithm = keyAlgorithm; }
    public int getKeySize() { return keySize; }
    public void setKeySize(int keySize) { this.keySize = keySize; }
    public String getSignatureAlgorithm() { return signatureAlgorithm; }
    public void setSignatureAlgorithm(String signatureAlgorithm) { this.signatureAlgorithm = signatureAlgorithm; }
    public boolean isSelfSigned() { return isSelfSigned; }
    public void setSelfSigned(boolean isSelfSigned) { this.isSelfSigned = isSelfSigned; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String subject;
        private String issuer;
        private Instant notBefore;
        private Instant notAfter;
        private long daysRemaining;
        private List<String> sans;
        private String keyAlgorithm;
        private int keySize;
        private String signatureAlgorithm;
        private boolean isSelfSigned;

        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder issuer(String issuer) { this.issuer = issuer; return this; }
        public Builder notBefore(Instant notBefore) { this.notBefore = notBefore; return this; }
        public Builder notAfter(Instant notAfter) { this.notAfter = notAfter; return this; }
        public Builder daysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; return this; }
        public Builder sans(List<String> sans) { this.sans = sans; return this; }
        public Builder keyAlgorithm(String keyAlgorithm) { this.keyAlgorithm = keyAlgorithm; return this; }
        public Builder keySize(int keySize) { this.keySize = keySize; return this; }
        public Builder signatureAlgorithm(String signatureAlgorithm) { this.signatureAlgorithm = signatureAlgorithm; return this; }
        public Builder isSelfSigned(boolean isSelfSigned) { this.isSelfSigned = isSelfSigned; return this; }

        public CertInfo build() {
            return new CertInfo(subject, issuer, notBefore, notAfter, daysRemaining, sans, keyAlgorithm, keySize, signatureAlgorithm, isSelfSigned);
        }
    }
}
