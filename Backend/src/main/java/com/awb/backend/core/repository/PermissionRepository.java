package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.entity.PermissionModule;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

  // Current seed data is one Permission per module; if that ever changes, this picks an
  // arbitrary match rather than failing, since module-level RolePermission resolution only needs
  // any one representative permission for that module.
  Optional<Permission> findFirstByModule(PermissionModule module);
}
