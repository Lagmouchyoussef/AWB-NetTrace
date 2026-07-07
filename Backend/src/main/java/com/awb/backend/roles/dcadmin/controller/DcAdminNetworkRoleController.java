package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.NetworkRoleRequest;
import com.awb.backend.core.dto.NetworkRoleResponse;
import com.awb.backend.core.entity.NetworkRoleStatus;
import com.awb.backend.roles.superadmin.service.NetworkRoleService;
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

// Delegates entirely to the same NetworkRoleService Super Admin uses, so audit logging and
// live notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/network-roles")
public class DcAdminNetworkRoleController {

  private final NetworkRoleService networkRoleService;

  public DcAdminNetworkRoleController(NetworkRoleService networkRoleService) {
    this.networkRoleService = networkRoleService;
  }

  @GetMapping
  public Page<NetworkRoleResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) NetworkRoleStatus status,
      Pageable pageable) {
    return networkRoleService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public NetworkRoleResponse getById(@PathVariable Long id) {
    return networkRoleService.getById(id);
  }

  @PostMapping
  public ResponseEntity<NetworkRoleResponse> create(
      @Valid @RequestBody NetworkRoleRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(networkRoleService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public NetworkRoleResponse update(
      @PathVariable Long id,
      @Valid @RequestBody NetworkRoleRequest request,
      Authentication authentication) {
    return networkRoleService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    networkRoleService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
