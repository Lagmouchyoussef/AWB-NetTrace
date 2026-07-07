package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.AuditLogRequest;
import com.awb.backend.core.dto.AuditLogResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.roles.superadmin.service.AuditLogService;
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

// Delegates entirely to the same AuditLogService Super Admin uses, so audit logging and live
// notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/audit-logs")
public class DcAdminAuditLogController {

  private final AuditLogService auditLogService;

  public DcAdminAuditLogController(AuditLogService auditLogService) {
    this.auditLogService = auditLogService;
  }

  @GetMapping
  public Page<AuditLogResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) AuditAction action,
      Pageable pageable) {
    return auditLogService.list(search, action, pageable);
  }

  @GetMapping("/{id}")
  public AuditLogResponse getById(@PathVariable Long id) {
    return auditLogService.getById(id);
  }

  @PostMapping
  public ResponseEntity<AuditLogResponse> create(@Valid @RequestBody AuditLogRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(auditLogService.create(request));
  }

  @PutMapping("/{id}")
  public AuditLogResponse update(
      @PathVariable Long id, @Valid @RequestBody AuditLogRequest request) {
    return auditLogService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    auditLogService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
