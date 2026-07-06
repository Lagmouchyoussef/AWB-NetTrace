package com.awb.backend.core.repository;

import com.awb.backend.core.entity.RealTimeDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RealTimeDashboardRepository
    extends JpaRepository<RealTimeDashboard, Long>, JpaSpecificationExecutor<RealTimeDashboard> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
