package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.EffectiveModulePermissionResponse;
import com.awb.backend.core.dto.UserPermissionOverrideRequest;
import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.roles.superadmin.service.UserPermissionOverrideService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Lets a Super Admin grant or revoke any individual user's access to any module, including
// modules outside that user's normal role territory - see ModulePermissionFilter for the
// enforcement side of this.
@RestController
@RequestMapping("/api/roles/super-admin/users/{userId}/permissions")
public class UserPermissionController {

  private final UserPermissionOverrideService overrideService;

  public UserPermissionController(UserPermissionOverrideService overrideService) {
    this.overrideService = overrideService;
  }

  @GetMapping
  public List<EffectiveModulePermissionResponse> getEffectivePermissions(
      @PathVariable Long userId) {
    return overrideService.getEffectivePermissions(userId);
  }

  @PutMapping("/{module}")
  public EffectiveModulePermissionResponse setOverride(
      @PathVariable Long userId,
      @PathVariable PermissionModule module,
      @Valid @RequestBody UserPermissionOverrideRequest request,
      Authentication authentication) {
    return overrideService.setOverride(
        userId, module, request.getGranted(), request.getNotes(), authentication.getName());
  }

  @DeleteMapping("/{module}")
  public EffectiveModulePermissionResponse clearOverride(
      @PathVariable Long userId,
      @PathVariable PermissionModule module,
      Authentication authentication) {
    return overrideService.clearOverride(userId, module, authentication.getName());
  }
}
