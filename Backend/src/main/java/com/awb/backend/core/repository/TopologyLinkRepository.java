package com.awb.backend.core.repository;

import com.awb.backend.core.entity.TopologyLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TopologyLinkRepository
    extends JpaRepository<TopologyLink, Long>, JpaSpecificationExecutor<TopologyLink> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
