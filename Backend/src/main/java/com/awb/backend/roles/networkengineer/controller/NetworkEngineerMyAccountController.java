package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.ChangePasswordRequest;
import com.awb.backend.core.dto.MyAccountResponse;
import com.awb.backend.core.dto.MyAccountUpdateRequest;
import com.awb.backend.roles.superadmin.service.MyAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same MyAccountService Super Admin uses - it already resolves everything from
// Authentication.getName() with no role-specific logic, so this is a pure self-service mirror
// under the Network Engineer URL namespace (see DcAdminMyAccountController for the same pattern).
// No IP-restriction/allowed-ips endpoints here: that's an admin/security concern, not relevant to
// this role's own account (see TechnicianMyAccountController for the same reasoning).
@RestController
@RequestMapping("/api/roles/network-engineer/my-account")
public class NetworkEngineerMyAccountController {

  private final MyAccountService myAccountService;

  public NetworkEngineerMyAccountController(MyAccountService myAccountService) {
    this.myAccountService = myAccountService;
  }

  @GetMapping
  public MyAccountResponse getMyAccount(Authentication authentication) {
    return myAccountService.getMyAccount(authentication.getName());
  }

  @PutMapping
  public MyAccountResponse updateMyAccount(
      Authentication authentication, @Valid @RequestBody MyAccountUpdateRequest request) {
    return myAccountService.updateMyAccount(authentication.getName(), request);
  }

  @PutMapping("/password")
  public ResponseEntity<Void> changePassword(
      Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
    myAccountService.changePassword(authentication.getName(), request);
    return ResponseEntity.noContent().build();
  }
}
