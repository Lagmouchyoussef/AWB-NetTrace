package com.awb.backend.controller;

import com.awb.backend.entity.AppPing;
import com.awb.backend.repository.AppPingRepository;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureController {

  private final AppPingRepository appPingRepository;

  public SecureController(AppPingRepository appPingRepository) {
    this.appPingRepository = appPingRepository;
  }

  @GetMapping("/api/secure/ping")
  public Map<String, String> ping(Authentication authentication) {
    return Map.of("message", "authenticated", "user", authentication.getName());
  }

  @GetMapping("/api/secure/db-ping")
  public Map<String, String> dbPing() {
    AppPing latest = appPingRepository.findFirstByOrderByIdDesc();
    return Map.of("message", latest.getMessage(), "createdAt", latest.getCreatedAt().toString());
  }
}
