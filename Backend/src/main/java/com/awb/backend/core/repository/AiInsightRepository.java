package com.awb.backend.core.repository;

import com.awb.backend.core.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AiInsightRepository
    extends JpaRepository<AiInsight, Long>, JpaSpecificationExecutor<AiInsight> {}
