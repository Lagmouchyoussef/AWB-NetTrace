package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.AllowedIpRequest;
import com.awb.backend.core.dto.AllowedIpResponse;
import com.awb.backend.core.dto.ChangePasswordRequest;
import com.awb.backend.core.dto.IpRestrictionRequest;
import com.awb.backend.core.dto.MyAccountResponse;
import com.awb.backend.core.dto.MyAccountUpdateRequest;
import com.awb.backend.roles.superadmin.service.MyAccountService;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same MyAccountService Super Admin uses - it already resolves everything from
// Authentication.getName() with no role-specific logic, so this is a pure self-service mirror
// under the DC Admin URL namespace (see DcAdminDatacenterController for the same pattern).
@RestController
@RequestMapping("/api/roles/dc-admin/my-account")
public class DcAdminMyAccountController {

  private final MyAccountService myAccountService;

  public DcAdminMyAccountController(MyAccountService myAccountService) {
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

  @PutMapping("/ip-restriction")
  public ResponseEntity<Void> setIpRestriction(
      Authentication authentication, @RequestBody IpRestrictionRequest request) {
    myAccountService.setIpRestrictionEnabled(
        authentication.getName(), request.isIpRestrictionEnabled());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/allowed-ips")
  public List<AllowedIpResponse> listAllowedIps(Authentication authentication) {
    return myAccountService.listAllowedIps(authentication.getName());
  }

  @PostMapping("/allowed-ips")
  public ResponseEntity<AllowedIpResponse> addAllowedIp(
      Authentication authentication, @Valid @RequestBody AllowedIpRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(myAccountService.addAllowedIp(authentication.getName(), request));
  }

  @DeleteMapping("/allowed-ips/{id}")
  public ResponseEntity<Void> deleteAllowedIp(
      Authentication authentication, @PathVariable Long id) {
    myAccountService.deleteAllowedIp(authentication.getName(), id);
    return ResponseEntity.noContent().build();
  }
}
