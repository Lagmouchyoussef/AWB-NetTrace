package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.AnomalyDetectionResponse;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.roles.superadmin.service.AnomalyDetectionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Read-only visibility into anomalies as a compliance signal (e.g. UNAUTHORIZED_ACCESS,
// CONFIG_DRIFT) - acknowledging/resolving an anomaly stays DC Admin/Network Engineer's job, an
// auditor only ever observes. GET mappings only, same rationale as AuditorAuditLogController.
@RestController
@RequestMapping("/api/roles/auditor/anomaly-detections")
public class AuditorAnomalyDetectionController {

  private final AnomalyDetectionService anomalyDetectionService;

  public AuditorAnomalyDetectionController(AnomalyDetectionService anomalyDetectionService) {
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
}
