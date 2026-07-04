package com.awb.backend.core.repository;

import com.awb.backend.core.entity.OverlayNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OverlayNetworkRepository
    extends JpaRepository<OverlayNetwork, Long>, JpaSpecificationExecutor<OverlayNetwork> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

  boolean existsByVni(Integer vni);

  boolean existsByVniAndIdNot(Integer vni, Long id);
}
