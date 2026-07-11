package com.awb.backend.roles.technician.controller;

import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.roles.superadmin.service.InterventionService;
import com.awb.backend.roles.technician.dto.RackElevationResponse;
import com.awb.backend.roles.technician.service.TechnicianExecutionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Field execution only - a technician sees and reads only interventions assigned to them (list is
// hard-scoped server-side, and getById 404s rather than 403s on someone else's record so a direct
// URL guess can't even confirm the record exists). No create/update/delete/approve here - only
// the SCHEDULED -> IN_PROGRESS -> COMPLETED walk (start/complete), gated by the checklist being
// fully done before closing.
@RestController
@RequestMapping("/api/roles/technician/interventions")
public class TechnicianInterventionController {

  private final InterventionService interventionService;
  private final TechnicianExecutionService executionService;

  public TechnicianInterventionController(
      InterventionService interventionService, TechnicianExecutionService executionService) {
    this.interventionService = interventionService;
    this.executionService = executionService;
  }

  @GetMapping
  public Page<InterventionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      Pageable pageable,
      Authentication authentication) {
    return interventionService.listByAssignee(
        authentication.getName(), search, status, priority, pageable);
  }

  @GetMapping("/{id}")
  public InterventionResponse getById(@PathVariable Long id, Authentication authentication) {
    return interventionService.getByIdForAssignee(id, authentication.getName());
  }

  @GetMapping("/{id}/rack-elevation")
  public RackElevationResponse getRackElevation(
      @PathVariable Long id, Authentication authentication) {
    return executionService.getRackElevation(id, authentication.getName());
  }

  @PatchMapping("/{id}/start")
  public InterventionResponse start(@PathVariable Long id, Authentication authentication) {
    return executionService.start(id, authentication.getName());
  }

  @PatchMapping("/{id}/complete")
  public InterventionResponse complete(@PathVariable Long id, Authentication authentication) {
    return executionService.complete(id, authentication.getName());
  }
}
