package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.RolePermissionRequest;
import com.awb.backend.core.dto.RolePermissionResponse;
import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.RolePermission;
import com.awb.backend.core.repository.PermissionRepository;
import com.awb.backend.core.repository.RolePermissionRepository;
import com.awb.backend.core.repository.RolePermissionSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RolePermissionService {

  private final RolePermissionRepository rolePermissionRepository;
  private final PermissionRepository permissionRepository;

  public RolePermissionService(
      RolePermissionRepository rolePermissionRepository,
      PermissionRepository permissionRepository) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
  }

  @Transactional(readOnly = true)
  public Page<RolePermissionResponse> list(String search, Role role, Pageable pageable) {
    Specification<RolePermission> spec =
        Specification.where(RolePermissionSpecifications.notDeleted())
            .and(RolePermissionSpecifications.search(search))
            .and(RolePermissionSpecifications.hasRole(role));
    return rolePermissionRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public RolePermissionResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public RolePermissionResponse create(RolePermissionRequest request) {
    if (rolePermissionRepository.existsByRoleAndPermissionIdAndDeletedFalse(
        request.getRole(), request.getPermissionId())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "This role already has an assignment for this permission.");
    }

    RolePermission rolePermission = new RolePermission();
    rolePermission.setPermission(findActivePermissionOrThrow(request.getPermissionId()));
    applyRequest(rolePermission, request);
    Instant now = Instant.now();
    rolePermission.setCreatedAt(now);
    rolePermission.setUpdatedAt(now);
    return toResponse(rolePermissionRepository.save(rolePermission));
  }

  @Transactional
  public RolePermissionResponse update(Long id, RolePermissionRequest request) {
    RolePermission rolePermission = findActiveOrThrow(id);
    if (rolePermissionRepository.existsByRoleAndPermissionIdAndDeletedFalseAndIdNot(
        request.getRole(), request.getPermissionId(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "This role already has an assignment for this permission.");
    }

    rolePermission.setPermission(findActivePermissionOrThrow(request.getPermissionId()));
    applyRequest(rolePermission, request);
    rolePermission.setUpdatedAt(Instant.now());
    return toResponse(rolePermissionRepository.save(rolePermission));
  }

  @Transactional
  public void delete(Long id) {
    RolePermission rolePermission = findActiveOrThrow(id);
    rolePermission.setDeleted(true);
    rolePermission.setUpdatedAt(Instant.now());
    rolePermissionRepository.save(rolePermission);
  }

  private RolePermission findActiveOrThrow(Long id) {
    RolePermission rolePermission =
        rolePermissionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Role permission not found."));
    if (rolePermission.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Role permission not found.");
    }
    return rolePermission;
  }

  private Permission findActivePermissionOrThrow(Long permissionId) {
    return permissionRepository
        .findById(permissionId)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Permission not found."));
  }

  private void applyRequest(RolePermission rolePermission, RolePermissionRequest request) {
    rolePermission.setRole(request.getRole());
    rolePermission.setGranted(request.isGranted());
    rolePermission.setNotes(request.getNotes());
  }

  private RolePermissionResponse toResponse(RolePermission rolePermission) {
    RolePermissionResponse response = new RolePermissionResponse();
    response.setId(rolePermission.getId());
    response.setRole(rolePermission.getRole());
    response.setPermissionId(rolePermission.getPermission().getId());
    response.setPermissionCode(rolePermission.getPermission().getCode());
    response.setPermissionName(rolePermission.getPermission().getName());
    response.setGranted(rolePermission.isGranted());
    response.setNotes(rolePermission.getNotes());
    response.setCreatedAt(rolePermission.getCreatedAt());
    response.setUpdatedAt(rolePermission.getUpdatedAt());
    return response;
  }
}
