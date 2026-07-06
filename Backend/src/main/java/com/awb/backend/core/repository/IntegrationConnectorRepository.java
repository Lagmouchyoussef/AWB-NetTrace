package com.awb.backend.core.repository;

import com.awb.backend.core.entity.IntegrationConnector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IntegrationConnectorRepository
    extends JpaRepository<IntegrationConnector, Long>,
        JpaSpecificationExecutor<IntegrationConnector> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
