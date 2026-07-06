package com.awb.backend.core.repository;

import com.awb.backend.core.entity.OverlayTunnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OverlayTunnelRepository
    extends JpaRepository<OverlayTunnel, Long>, JpaSpecificationExecutor<OverlayTunnel> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
