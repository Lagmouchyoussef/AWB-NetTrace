package com.awb.backend.roles.requester.controller;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/requester")
public class RequesterController {

  @GetMapping("/ping")
  public Map<String, String> ping(Authentication authentication) {
    return Map.of(
        "message", "authenticated", "role", "REQUESTER", "user", authentication.getName());
  }
}
