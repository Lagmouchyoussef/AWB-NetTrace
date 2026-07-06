package com.awb.backend.core.repository;

import com.awb.backend.core.entity.SyncDrift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SyncDriftRepository
    extends JpaRepository<SyncDrift, Long>, JpaSpecificationExecutor<SyncDrift> {}
