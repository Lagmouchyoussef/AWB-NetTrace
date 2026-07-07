package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.UserRequest;
import com.awb.backend.core.dto.UserResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.roles.superadmin.service.UserManagementService;
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
@RequestMapping("/api/roles/super-admin/users")
public class UserManagementController {

  private final UserManagementService userManagementService;

  public UserManagementController(UserManagementService userManagementService) {
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

  @PostMapping
  public ResponseEntity<UserResponse> create(
      @Valid @RequestBody UserRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(userManagementService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public UserResponse update(
      @PathVariable Long id, @Valid @RequestBody UserRequest request, Authentication authentication) {
    return userManagementService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    userManagementService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
