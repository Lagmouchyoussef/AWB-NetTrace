package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.UserResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.roles.superadmin.service.UserManagementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Access-review directory: who has an account, which role, enabled/IP-restricted state. Only GET
// mappings exist - see AuditorAuditLogController for why.
@RestController
@RequestMapping("/api/roles/auditor/users")
public class AuditorUserController {

  private final UserManagementService userManagementService;

  public AuditorUserController(UserManagementService userManagementService) {
    this.userManagementService = userManagementService;
  }

  @GetMapping
  public Page<UserResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) Role role,
      Pageable pageable) {
    return userManagementService.list(search, role, pageable);
  }

  @GetMapping("/{id}")
  public UserResponse getById(@PathVariable Long id) {
    return userManagementService.getById(id);
  }
}
