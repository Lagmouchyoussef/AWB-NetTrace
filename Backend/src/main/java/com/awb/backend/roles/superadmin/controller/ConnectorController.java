package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.ConnectorRequest;
import com.awb.backend.core.dto.ConnectorResponse;
import com.awb.backend.core.entity.ConnectorStatus;
import com.awb.backend.roles.superadmin.service.ConnectorService;
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
@RequestMapping("/api/roles/super-admin/connectors")
public class ConnectorController {

  private final ConnectorService connectorService;

  public ConnectorController(ConnectorService connectorService) {
    this.connectorService = connectorService;
  }

  @GetMapping
  public Page<ConnectorResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) ConnectorStatus status,
      Pageable pageable) {
    return connectorService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public ConnectorResponse getById(@PathVariable Long id) {
    return connectorService.getById(id);
  }

  @PostMapping
  public ResponseEntity<ConnectorResponse> create(
      @Valid @RequestBody ConnectorRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(connectorService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public ConnectorResponse update(
      @PathVariable Long id,
      @Valid @RequestBody ConnectorRequest request,
      Authentication authentication) {
    return connectorService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    connectorService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
