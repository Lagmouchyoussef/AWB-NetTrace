package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.SystemSettingResponse;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.roles.superadmin.service.SystemSettingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Configuration review: the live system settings (security, notifications, integrations, ...).
// Only GET mappings exist - see AuditorAuditLogController for why.
@RestController
@RequestMapping("/api/roles/auditor/system-settings")
public class AuditorSystemSettingController {

  private final SystemSettingService systemSettingService;

  public AuditorSystemSettingController(SystemSettingService systemSettingService) {
    this.systemSettingService = systemSettingService;
  }

  @GetMapping
  public Page<SystemSettingResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) SystemSettingCategory category,
      Pageable pageable) {
    return systemSettingService.list(search, category, pageable);
  }

  @GetMapping("/{id}")
  public SystemSettingResponse getById(@PathVariable Long id) {
    return systemSettingService.getById(id);
  }
}
