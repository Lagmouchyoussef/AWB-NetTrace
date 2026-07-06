package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.SystemSettingRequest;
import com.awb.backend.core.dto.SystemSettingResponse;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.roles.superadmin.service.SystemSettingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/system-settings")
public class SystemSettingController {

  private final SystemSettingService systemSettingService;

  public SystemSettingController(SystemSettingService systemSettingService) {
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

  @PostMapping
  public ResponseEntity<SystemSettingResponse> create(
      @Valid @RequestBody SystemSettingRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(systemSettingService.create(request));
  }

  @PutMapping("/{id}")
  public SystemSettingResponse update(
      @PathVariable Long id, @Valid @RequestBody SystemSettingRequest request) {
    return systemSettingService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    systemSettingService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
