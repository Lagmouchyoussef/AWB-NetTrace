package com.awb.backend.roles.auditor.controller;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/auditor")
public class AuditorController {

  @GetMapping("/ping")
  public Map<String, String> ping(Authentication authentication) {
    return Map.of("message", "authenticated", "role", "AUDITOR", "user", authentication.getName());
  }
}
