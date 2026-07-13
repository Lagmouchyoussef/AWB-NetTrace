package com.awb.backend.roles.requester.controller;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// This role only ever sees its own requests (list is hard-scoped to the caller's username) and
// can only submit or withdraw new ones - no approve/reject/update endpoints, matching "can only
// submit requests, tracked personally, no infrastructure visibility" from the role brief. Mirrors
// NetworkEngineerInterventionController (list/create) plus the withdraw-my-own-pending-request
// endpoint from ApproverInterventionController.deleteMyRequest.
@RestController
@RequestMapping("/api/roles/requester/interventions")
public class RequesterInterventionController {

  private final InterventionService interventionService;

  public RequesterInterventionController(InterventionService interventionService) {
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

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    interventionService.deleteOwnRequest(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
