package com.awb.backend.roles.superadmin.controller;

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
@RequestMapping("/api/roles/super-admin/telemetry-connectors")
public class TelemetryConnectorController {

  private final TelemetryConnectorService telemetryConnectorService;

  public TelemetryConnectorController(TelemetryConnectorService telemetryConnectorService) {
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

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    telemetryConnectorService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
