package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.AnomalyDetectionRequest;
import com.awb.backend.core.dto.AnomalyDetectionResponse;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.roles.superadmin.service.AnomalyDetectionService;
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

@RestController
@RequestMapping("/api/roles/super-admin/anomaly-detections")
public class AnomalyDetectionController {

  private final AnomalyDetectionService anomalyDetectionService;

  public AnomalyDetectionController(AnomalyDetectionService anomalyDetectionService) {
    this.anomalyDetectionService = anomalyDetectionService;
  }

  @GetMapping
  public Page<AnomalyDetectionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) AnomalyDetectionStatus status,
      @RequestParam(required = false) AnomalySeverity severity,
      Pageable pageable) {
    return anomalyDetectionService.list(search, status, severity, pageable);
  }

  @GetMapping("/{id}")
  public AnomalyDetectionResponse getById(@PathVariable Long id) {
    return anomalyDetectionService.getById(id);
  }

  @PostMapping
  public ResponseEntity<AnomalyDetectionResponse> create(
      @Valid @RequestBody AnomalyDetectionRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(anomalyDetectionService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public AnomalyDetectionResponse update(
      @PathVariable Long id,
      @Valid @RequestBody AnomalyDetectionRequest request,
      Authentication authentication) {
    return anomalyDetectionService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    anomalyDetectionService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
