package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.DatacenterScopeResponse;
import com.awb.backend.roles.dcadmin.service.DcAdminScopeService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Backs the topbar "scope indicator" - the datacenters this DC Admin is actually assigned to,
// so the UI never silently implies system-wide access.
@RestController
@RequestMapping("/api/roles/dc-admin/scope")
public class DcAdminScopeController {

  private final DcAdminScopeService scopeService;

  public DcAdminScopeController(DcAdminScopeService scopeService) {
    this.scopeService = scopeService;
  }

  @GetMapping("/datacenters")
  public List<DatacenterScopeResponse> getAssignedDatacenters(Authentication authentication) {
    return scopeService.getAssignedDatacenters(authentication);
  }
}
