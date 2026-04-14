package com.webguardx.app.service;

import com.webguardx.app.model.ScheduledScan;
import com.webguardx.app.model.User;
import com.webguardx.app.repository.ScheduledScanRepository;
import com.webguardx.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);

    @Autowired
    private ScheduledScanRepository scheduledScanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ZapService zapService;

    // Run every hour
    @Scheduled(fixedRate = 3600000)
    public void runScheduledScans() {
        logger.info("Checking for scheduled scans at {}", LocalDateTime.now());
        
        List<ScheduledScan> pendingScans = scheduledScanRepository.findByNextRunTimeBefore(LocalDateTime.now());
        
        for (ScheduledScan scan : pendingScans) {
            logger.info("Executing scheduled scan for URL: {}", scan.getTargetUrl());
            
            Optional<User> userOpt = userRepository.findById(scan.getUserId());
            if (userOpt.isPresent()) {
                // Execute the scan
                zapService.scan(scan.getTargetUrl(), scan.isActiveScan(), userOpt.get());
                
                // Update next run time
                if ("DAILY".equalsIgnoreCase(scan.getScheduleType())) {
                    scan.setNextRunTime(LocalDateTime.now().plusDays(1));
                } else if ("WEEKLY".equalsIgnoreCase(scan.getScheduleType())) {
                    scan.setNextRunTime(LocalDateTime.now().plusWeeks(1));
                }
                scheduledScanRepository.save(scan);
                logger.info("Scheduled scan completed and rescheduled.");
            } else {
                logger.error("User not found for scheduled scan ID: {}", scan.getId());
            }
        }
    }
}
