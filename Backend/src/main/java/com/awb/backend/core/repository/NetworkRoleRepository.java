package com.awb.backend.core.repository;

import com.awb.backend.core.entity.NetworkRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NetworkRoleRepository
    extends JpaRepository<NetworkRole, Long>, JpaSpecificationExecutor<NetworkRole> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

  boolean existsByDeviceIdAndDeletedFalse(Long deviceId);

  boolean existsByDeviceIdAndDeletedFalseAndIdNot(Long deviceId, Long id);

  Optional<NetworkRole> findByCodeIgnoreCase(String code);
}
