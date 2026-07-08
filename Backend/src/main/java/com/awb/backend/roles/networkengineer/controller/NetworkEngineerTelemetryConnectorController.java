package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.TelemetryConnectorRequest;
import com.awb.backend.core.dto.TelemetryConnectorResponse;
import com.awb.backend.core.entity.TelemetryConnectorStatus;
import com.awb.backend.roles.superadmin.service.TelemetryConnectorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same TelemetryConnectorService Super Admin uses. No delete endpoint -
// decommission via status.
@RestController
@RequestMapping("/api/roles/network-engineer/telemetry-connectors")
public class NetworkEngineerTelemetryConnectorController {

  private final TelemetryConnectorService telemetryConnectorService;

  public NetworkEngineerTelemetryConnectorController(
      TelemetryConnectorService telemetryConnectorService) {
    this.telemetryConnectorService = telemetryConnectorService;
  }

  @GetMapping
  public Page<TelemetryConnectorResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) TelemetryConnectorStatus status,
      Pageable pageable) {
    return telemetryConnectorService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public TelemetryConnectorResponse getById(@PathVariable Long id) {
    return telemetryConnectorService.getById(id);
  }

  @PostMapping
  public ResponseEntity<TelemetryConnectorResponse> create(
      @Valid @RequestBody TelemetryConnectorRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(telemetryConnectorService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public TelemetryConnectorResponse update(
      @PathVariable Long id,
      @Valid @RequestBody TelemetryConnectorRequest request,
      Authentication authentication) {
    return telemetryConnectorService.update(id, request, authentication.getName());
  }
}
