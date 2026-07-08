package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.InterventionRequest;
import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.roles.superadmin.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// This role only ever sees its own requests (list is hard-scoped to the caller's username, no
// id path variable) and can only submit new ones - no approve/reject/update/delete endpoints,
// matching "can only submit requests, tracked personally" from the role brief. Requests start
// PENDING approval, same createPendingApproval path DC Admin's own creation flow uses.
@RestController
@RequestMapping("/api/roles/network-engineer/interventions")
public class NetworkEngineerInterventionController {

  private final InterventionService interventionService;

  public NetworkEngineerInterventionController(InterventionService interventionService) {
    this.interventionService = interventionService;
  }

  @GetMapping
  public Page<InterventionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      Pageable pageable,
      Authentication authentication) {
    return interventionService.listByRequester(
        authentication.getName(), search, status, priority, pageable);
  }

  @PostMapping
  public ResponseEntity<InterventionResponse> create(
      @Valid @RequestBody InterventionRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(interventionService.createPendingApproval(request, authentication.getName()));
  }
}
