package com.webguardx.app.repository;

import com.webguardx.app.model.ScheduledScan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ScheduledScanRepository extends MongoRepository<ScheduledScan, String> {
    List<ScheduledScan> findByNextRunTimeBefore(LocalDateTime time);
}
