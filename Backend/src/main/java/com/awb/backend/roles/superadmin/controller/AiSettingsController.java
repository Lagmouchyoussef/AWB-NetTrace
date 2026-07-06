package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.AiSettingsResponse;
import com.awb.backend.core.dto.AiSettingsUpdateRequest;
import com.awb.backend.roles.superadmin.service.AiSettingsService;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/ai/settings")
public class AiSettingsController {

  private final AiSettingsService aiSettingsService;

  public AiSettingsController(AiSettingsService aiSettingsService) {
    this.aiSettingsService = aiSettingsService;
  }

  @GetMapping
  public AiSettingsResponse get() {
    return aiSettingsService.get();
  }

  @PutMapping
  public AiSettingsResponse update(@RequestBody AiSettingsUpdateRequest request, Principal principal) {
    return aiSettingsService.update(request, principal.getName());
  }
}
