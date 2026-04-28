package com.webguardx.ssl.model;

public class HstsInfo {
    private boolean present;
    private long maxAge;
    private boolean includeSubDomains;
    private boolean preload;

    public HstsInfo() {}

    public HstsInfo(boolean present, long maxAge, boolean includeSubDomains, boolean preload) {
        this.present = present;
        this.maxAge = maxAge;
        this.includeSubDomains = includeSubDomains;
        this.preload = preload;
    }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }
    public long getMaxAge() { return maxAge; }
    public void setMaxAge(long maxAge) { this.maxAge = maxAge; }
    public boolean isIncludeSubDomains() { return includeSubDomains; }
    public void setIncludeSubDomains(boolean includeSubDomains) { this.includeSubDomains = includeSubDomains; }
    public boolean isPreload() { return preload; }
    public void setPreload(boolean preload) { this.preload = preload; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean present;
        private long maxAge;
        private boolean includeSubDomains;
        private boolean preload;

        public Builder present(boolean present) { this.present = present; return this; }
        public Builder maxAge(long maxAge) { this.maxAge = maxAge; return this; }
        public Builder includeSubDomains(boolean includeSubDomains) { this.includeSubDomains = includeSubDomains; return this; }
        public Builder preload(boolean preload) { this.preload = preload; return this; }

        public HstsInfo build() {
            return new HstsInfo(present, maxAge, includeSubDomains, preload);
        }
    }
}
