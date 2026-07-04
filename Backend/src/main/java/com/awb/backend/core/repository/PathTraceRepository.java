package com.awb.backend.core.repository;

import com.awb.backend.core.entity.PathTrace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PathTraceRepository
    extends JpaRepository<PathTrace, Long>, JpaSpecificationExecutor<PathTrace> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
