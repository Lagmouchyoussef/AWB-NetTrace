package com.awb.backend.roles.dcadmin.controller;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/dc-admin")
public class DcAdminController {

  @GetMapping("/ping")
  public Map<String, String> ping(Authentication authentication) {
    return Map.of("message", "authenticated", "role", "DC_ADMIN", "user", authentication.getName());
  }
}
