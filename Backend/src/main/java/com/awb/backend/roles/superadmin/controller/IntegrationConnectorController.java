package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.IntegrationConnectorRequest;
import com.awb.backend.core.dto.IntegrationConnectorResponse;
import com.awb.backend.core.entity.IntegrationConnectorStatus;
import com.awb.backend.roles.superadmin.service.IntegrationConnectorService;
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
@RequestMapping("/api/roles/super-admin/integration-connectors")
public class IntegrationConnectorController {

  private final IntegrationConnectorService integrationConnectorService;

  public IntegrationConnectorController(IntegrationConnectorService integrationConnectorService) {
    this.integrationConnectorService = integrationConnectorService;
  }

  @GetMapping
  public Page<IntegrationConnectorResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) IntegrationConnectorStatus status,
      Pageable pageable) {
    return integrationConnectorService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public IntegrationConnectorResponse getById(@PathVariable Long id) {
    return integrationConnectorService.getById(id);
  }

  @PostMapping
  public ResponseEntity<IntegrationConnectorResponse> create(
      @Valid @RequestBody IntegrationConnectorRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(integrationConnectorService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public IntegrationConnectorResponse update(
      @PathVariable Long id,
      @Valid @RequestBody IntegrationConnectorRequest request,
      Authentication authentication) {
    return integrationConnectorService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    integrationConnectorService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
