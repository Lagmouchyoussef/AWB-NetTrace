package com.awb.backend.roles.technician.controller;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/technician")
public class TechnicianController {

  @GetMapping("/ping")
  public Map<String, String> ping(Authentication authentication) {
    return Map.of(
        "message", "authenticated", "role", "TECHNICIAN", "user", authentication.getName());
  }
}
