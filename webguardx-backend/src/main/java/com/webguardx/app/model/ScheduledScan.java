package com.webguardx.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "scheduled_scans")
public class ScheduledScan {

    @Id
    private String id;
    
    private String userId;
    private String userEmail;
    
    private String targetUrl;
    private boolean activeScan;
    
    private String scheduleType; // "DAILY", "WEEKLY"
    
    private LocalDateTime nextRunTime;

    public ScheduledScan() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }

    public boolean isActiveScan() { return activeScan; }
    public void setActiveScan(boolean activeScan) { this.activeScan = activeScan; }

    public String getScheduleType() { return scheduleType; }
    public void setScheduleType(String scheduleType) { this.scheduleType = scheduleType; }

    public LocalDateTime getNextRunTime() { return nextRunTime; }
    public void setNextRunTime(LocalDateTime nextRunTime) { this.nextRunTime = nextRunTime; }
}
