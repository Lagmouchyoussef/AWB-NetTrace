package com.awb.backend.core.repository;

import com.awb.backend.core.entity.TelemetryConnector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TelemetryConnectorRepository
    extends JpaRepository<TelemetryConnector, Long>, JpaSpecificationExecutor<TelemetryConnector> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
