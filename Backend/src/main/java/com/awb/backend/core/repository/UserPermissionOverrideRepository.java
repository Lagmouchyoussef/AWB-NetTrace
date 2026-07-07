package com.awb.backend.core.repository;

import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.core.entity.UserPermissionOverride;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPermissionOverrideRepository
    extends JpaRepository<UserPermissionOverride, Long> {

  List<UserPermissionOverride> findByUserId(Long userId);

  Optional<UserPermissionOverride> findByUserIdAndModule(Long userId, PermissionModule module);
}
