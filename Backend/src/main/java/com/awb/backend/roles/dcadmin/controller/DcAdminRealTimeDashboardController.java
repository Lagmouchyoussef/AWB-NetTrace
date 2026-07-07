package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.RealTimeDashboardRequest;
import com.awb.backend.core.dto.RealTimeDashboardResponse;
import com.awb.backend.core.entity.RealTimeDashboardStatus;
import com.awb.backend.roles.superadmin.service.RealTimeDashboardService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates entirely to the same RealTimeDashboardService Super Admin uses, so audit logging
// and live notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/real-time-dashboards")
public class DcAdminRealTimeDashboardController {

  private final RealTimeDashboardService realTimeDashboardService;

  public DcAdminRealTimeDashboardController(RealTimeDashboardService realTimeDashboardService) {
    this.realTimeDashboardService = realTimeDashboardService;
  }

  @GetMapping
  public Page<RealTimeDashboardResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) RealTimeDashboardStatus status,
      Pageable pageable) {
    return realTimeDashboardService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public RealTimeDashboardResponse getById(@PathVariable Long id) {
    return realTimeDashboardService.getById(id);
  }

  @PostMapping
  public ResponseEntity<RealTimeDashboardResponse> create(
      @Valid @RequestBody RealTimeDashboardRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(realTimeDashboardService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public RealTimeDashboardResponse update(
      @PathVariable Long id,
      @Valid @RequestBody RealTimeDashboardRequest request,
      Authentication authentication) {
    return realTimeDashboardService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    realTimeDashboardService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
