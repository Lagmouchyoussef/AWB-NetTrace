package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.ApprovalStatus;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.roles.superadmin.service.InterventionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Unscoped, read-only trail across every intervention regardless of status/decision - the
// auditor's equivalent of Approver's "All Interventions" screen. Only GET mappings exist: an
// auditor's value comes from being unable to alter the trail they're reviewing (see
// AuditorAuditLogController).
@RestController
@RequestMapping("/api/roles/auditor/interventions")
public class AuditorInterventionController {

  private final InterventionService interventionService;

  public AuditorInterventionController(InterventionService interventionService) {
    this.interventionService = interventionService;
  }

  @GetMapping
  public Page<InterventionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      @RequestParam(required = false) ApprovalStatus approvalStatus,
      Pageable pageable) {
    return interventionService.list(search, status, priority, approvalStatus, pageable);
  }

  @GetMapping("/{id}")
  public InterventionResponse getById(@PathVariable Long id) {
    return interventionService.getById(id);
  }
}
