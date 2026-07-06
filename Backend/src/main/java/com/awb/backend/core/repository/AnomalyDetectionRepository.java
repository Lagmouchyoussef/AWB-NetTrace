package com.awb.backend.core.repository;

import com.awb.backend.core.entity.AnomalyDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AnomalyDetectionRepository
    extends JpaRepository<AnomalyDetection, Long>, JpaSpecificationExecutor<AnomalyDetection> {}
