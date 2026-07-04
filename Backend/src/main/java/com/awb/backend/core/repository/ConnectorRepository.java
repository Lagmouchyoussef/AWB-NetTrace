package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Connector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ConnectorRepository
    extends JpaRepository<Connector, Long>, JpaSpecificationExecutor<Connector> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
