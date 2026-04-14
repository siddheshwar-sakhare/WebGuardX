package com.webguardx.app.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.webguardx.app.model.ScanHistory;

public interface ScanHistoryRepository extends MongoRepository<ScanHistory, String> {

    List<ScanHistory> findByUserEmail(String userEmail);
}
