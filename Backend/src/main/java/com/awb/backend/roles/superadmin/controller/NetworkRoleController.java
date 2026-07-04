package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.NetworkRoleRequest;
import com.awb.backend.core.dto.NetworkRoleResponse;
import com.awb.backend.core.entity.NetworkRoleStatus;
import com.awb.backend.roles.superadmin.service.NetworkRoleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/roles/super-admin/network-roles")
public class NetworkRoleController {

  private final NetworkRoleService networkRoleService;

  public NetworkRoleController(NetworkRoleService networkRoleService) {
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
      @Valid @RequestBody NetworkRoleRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(networkRoleService.create(request));
  }

  @PutMapping("/{id}")
  public NetworkRoleResponse update(
      @PathVariable Long id, @Valid @RequestBody NetworkRoleRequest request) {
    return networkRoleService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    networkRoleService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
