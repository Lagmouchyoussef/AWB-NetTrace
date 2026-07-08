package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.UserResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.roles.superadmin.service.UserManagementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Read-only technician lookup for the intervention form's assignee picker - DC Admin has no user
// management screen of its own, so this exposes just enough of the shared UserManagementService
// (already filterable by role) to populate a dropdown, nothing else.
@RestController
@RequestMapping("/api/roles/dc-admin/technicians")
public class DcAdminTechnicianController {

  private final UserManagementService userManagementService;

  public DcAdminTechnicianController(UserManagementService userManagementService) {
    this.userManagementService = userManagementService;
  }

  @GetMapping
  public Page<UserResponse> list(@RequestParam(required = false) String search, Pageable pageable) {
    return userManagementService.list(search, Role.TECHNICIAN, pageable);
  }
}
