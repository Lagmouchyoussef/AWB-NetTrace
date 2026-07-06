package com.awb.backend.core.repository;

import com.awb.backend.core.entity.TechnologyCatalogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TechnologyCatalogRepository
    extends JpaRepository<TechnologyCatalogEntry, Long>,
        JpaSpecificationExecutor<TechnologyCatalogEntry> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
