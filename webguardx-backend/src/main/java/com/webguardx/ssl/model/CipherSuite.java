package com.webguardx.ssl.model;

public class CipherSuite {
    private String name;
    private String protocol;
    private String grade;

    public CipherSuite() {}

    public CipherSuite(String name, String protocol, String grade) {
        this.name = name;
        this.protocol = protocol;
        this.grade = grade;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String protocol;
        private String grade;

        public Builder name(String name) { this.name = name; return this; }
        public Builder protocol(String protocol) { this.protocol = protocol; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }

        public CipherSuite build() {
            return new CipherSuite(name, protocol, grade);
        }
    }
}
