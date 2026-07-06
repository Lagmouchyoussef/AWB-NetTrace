package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.PermissionResponse;
import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.repository.PermissionRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/permissions")
public class PermissionController {

  private final PermissionRepository permissionRepository;

  public PermissionController(PermissionRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  @GetMapping
  public List<PermissionResponse> list() {
    return permissionRepository.findAll().stream().map(this::toResponse).toList();
  }

  private PermissionResponse toResponse(Permission permission) {
    PermissionResponse response = new PermissionResponse();
    response.setId(permission.getId());
    response.setCode(permission.getCode());
    response.setName(permission.getName());
    response.setModule(permission.getModule());
    response.setDescription(permission.getDescription());
    return response;
  }
}
