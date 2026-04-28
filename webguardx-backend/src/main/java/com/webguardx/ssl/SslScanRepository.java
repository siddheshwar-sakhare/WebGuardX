package com.webguardx.ssl;

import com.webguardx.ssl.model.SslScanResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SSL scan results.
 */
@Repository
public interface SslScanRepository extends MongoRepository<SslScanResult, String> {
    
    /**
     * Finds SSL scans by user email, ordered by scan date descending.
     * @param email the user email
     * @return list of SslScanResult
     */
    List<SslScanResult> findByUserEmailOrderByScannedAtDesc(String email);
}
