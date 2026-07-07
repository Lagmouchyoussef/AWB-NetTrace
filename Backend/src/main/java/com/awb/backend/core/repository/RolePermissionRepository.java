package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.RolePermission;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RolePermissionRepository
    extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {

  boolean existsByRoleAndPermissionIdAndDeletedFalse(Role role, Long permissionId);

  boolean existsByRoleAndPermissionIdAndDeletedFalseAndIdNot(Role role, Long permissionId, Long id);

  Optional<RolePermission> findFirstByRoleAndPermissionIdAndDeletedFalse(
      Role role, Long permissionId);
}
