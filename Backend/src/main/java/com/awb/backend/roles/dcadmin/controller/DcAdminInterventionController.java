package com.awb.backend.roles.dcadmin.controller;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same InterventionService Super Admin uses - see DcAdminDatacenterController.
@RestController
@RequestMapping("/api/roles/dc-admin/interventions")
public class DcAdminInterventionController {

  private final InterventionService interventionService;

  public DcAdminInterventionController(InterventionService interventionService) {
    this.interventionService = interventionService;
  }

  @GetMapping
  public Page<InterventionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      Pageable pageable) {
    return interventionService.list(search, status, priority, pageable);
  }

  @GetMapping("/{id}")
  public InterventionResponse getById(@PathVariable Long id) {
    return interventionService.getById(id);
  }

  @PostMapping
  public ResponseEntity<InterventionResponse> create(
      @Valid @RequestBody InterventionRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(interventionService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public InterventionResponse update(
      @PathVariable Long id,
      @Valid @RequestBody InterventionRequest request,
      Authentication authentication) {
    return interventionService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    interventionService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
