package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.SyncDriftRequest;
import com.awb.backend.core.dto.SyncDriftResponse;
import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.SyncDriftStatus;
import com.awb.backend.roles.superadmin.service.SyncDriftService;
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
@RequestMapping("/api/roles/super-admin/sync-drifts")
public class SyncDriftController {

  private final SyncDriftService syncDriftService;

  public SyncDriftController(SyncDriftService syncDriftService) {
    this.syncDriftService = syncDriftService;
  }

  @GetMapping
  public Page<SyncDriftResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) SyncDriftStatus status,
      @RequestParam(required = false) DriftSeverity severity,
      Pageable pageable) {
    return syncDriftService.list(search, status, severity, pageable);
  }

  @GetMapping("/{id}")
  public SyncDriftResponse getById(@PathVariable Long id) {
    return syncDriftService.getById(id);
  }

  @PostMapping
  public ResponseEntity<SyncDriftResponse> create(
      @Valid @RequestBody SyncDriftRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(syncDriftService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public SyncDriftResponse update(
      @PathVariable Long id,
      @Valid @RequestBody SyncDriftRequest request,
      Authentication authentication) {
    return syncDriftService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    syncDriftService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
