package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.AuditLogResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.roles.superadmin.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Independent oversight only - GET endpoints exist, nothing else. Unlike the Network Engineer
// read-only precedent (write endpoints left in place, only the frontend hides them), this
// controller physically has no create/update/delete mapping at all: an auditor's value comes
// from being unable to alter the trail they're reviewing, not just being discouraged from it by
// the UI. Unscoped (whole system, not per-datacenter) - an auditor must see everything.
@RestController
@RequestMapping("/api/roles/auditor/audit-logs")
public class AuditorAuditLogController {

  private final AuditLogService auditLogService;

  public AuditorAuditLogController(AuditLogService auditLogService) {
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
}
