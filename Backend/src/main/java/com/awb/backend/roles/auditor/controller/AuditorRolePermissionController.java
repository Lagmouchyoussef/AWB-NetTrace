package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.RolePermissionResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.roles.superadmin.service.RolePermissionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Privilege review: which modules are granted/denied per role. Only GET mappings exist - see
// AuditorAuditLogController for why.
@RestController
@RequestMapping("/api/roles/auditor/role-permissions")
public class AuditorRolePermissionController {

  private final RolePermissionService rolePermissionService;

  public AuditorRolePermissionController(RolePermissionService rolePermissionService) {
    this.rolePermissionService = rolePermissionService;
  }

  @GetMapping
  public Page<RolePermissionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) Role role,
      Pageable pageable) {
    return rolePermissionService.list(search, role, pageable);
  }

  @GetMapping("/{id}")
  public RolePermissionResponse getById(@PathVariable Long id) {
    return rolePermissionService.getById(id);
  }
}
