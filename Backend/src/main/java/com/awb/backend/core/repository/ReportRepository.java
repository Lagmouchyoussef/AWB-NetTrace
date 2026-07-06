package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReportRepository
    extends JpaRepository<Report, Long>, JpaSpecificationExecutor<Report> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
