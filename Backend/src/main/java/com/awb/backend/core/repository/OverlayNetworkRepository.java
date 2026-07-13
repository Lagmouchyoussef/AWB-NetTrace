package com.awb.backend.core.repository;

import com.awb.backend.core.entity.OverlayNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OverlayNetworkRepository
    extends JpaRepository<OverlayNetwork, Long>, JpaSpecificationExecutor<OverlayNetwork> {}
