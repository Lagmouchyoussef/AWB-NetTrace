package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.RolePermissionRequest;
import com.awb.backend.core.dto.RolePermissionResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.roles.superadmin.service.RolePermissionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/role-permissions")
public class RolePermissionController {

  private final RolePermissionService rolePermissionService;

  public RolePermissionController(RolePermissionService rolePermissionService) {
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

  @PostMapping
  public ResponseEntity<RolePermissionResponse> create(
      @Valid @RequestBody RolePermissionRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(rolePermissionService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public RolePermissionResponse update(
      @PathVariable Long id,
      @Valid @RequestBody RolePermissionRequest request,
      Authentication authentication) {
    return rolePermissionService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    rolePermissionService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
