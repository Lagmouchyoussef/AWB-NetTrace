package com.awb.backend.config;

import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.RolePermission;
import com.awb.backend.core.repository.PermissionRepository;
import com.awb.backend.core.repository.RolePermissionRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo role-to-permission assignments on first startup (only if the table is empty). Looks
 * permissions up by code rather than assuming ids, so it stays correct regardless of seeder
 * execution order. Dev/demo data only.
 */
@Component
@Order(21)
public class RolePermissionSeeder implements CommandLineRunner {

  private final RolePermissionRepository rolePermissionRepository;
  private final PermissionRepository permissionRepository;

  public RolePermissionSeeder(
      RolePermissionRepository rolePermissionRepository,
      PermissionRepository permissionRepository) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
  }

  @Override
  public void run(String... args) {
    if (rolePermissionRepository.count() > 0) {
      return;
    }

    seed(Role.SUPER_ADMIN, "administration.manage", true, null);
    seed(Role.SUPER_ADMIN, "infrastructure.manage", true, null);
    seed(Role.DC_ADMIN, "infrastructure.manage", true, null);
    seed(Role.NETWORK_ENGINEER, "fabric.manage", true, null);
    seed(Role.NETWORK_ENGINEER, "sdwan.manage", true, null);
    seed(Role.TECHNICIAN, "cabling.manage", true, null);
    seed(Role.AUDITOR, "audit.view", true, null);
    seed(Role.AUDITOR, "reports.view", true, null);
    seed(Role.REQUESTER, "reports.view", false, "En attente de validation par un administrateur.");
  }

  private void seed(Role role, String permissionCode, boolean granted, String notes) {
    Permission permission =
        permissionRepository.findAll().stream()
            .filter(p -> p.getCode().equals(permissionCode))
            .findFirst()
            .orElse(null);
    if (permission == null) {
      return;
    }

    RolePermission rolePermission = new RolePermission();
    rolePermission.setRole(role);
    rolePermission.setPermission(permission);
    rolePermission.setGranted(granted);
    rolePermission.setNotes(notes);
    Instant now = Instant.now();
    rolePermission.setCreatedAt(now);
    rolePermission.setUpdatedAt(now);
    rolePermissionRepository.save(rolePermission);
  }
}
