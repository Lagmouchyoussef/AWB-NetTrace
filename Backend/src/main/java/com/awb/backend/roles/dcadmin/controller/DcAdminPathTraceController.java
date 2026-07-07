package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.PathTraceRequest;
import com.awb.backend.core.dto.PathTraceResponse;
import com.awb.backend.core.entity.PathTraceStatus;
import com.awb.backend.roles.superadmin.service.PathTraceService;
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

// Delegates entirely to the same PathTraceService Super Admin uses, so audit logging and live
// notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/path-traces")
public class DcAdminPathTraceController {

  private final PathTraceService pathTraceService;

  public DcAdminPathTraceController(PathTraceService pathTraceService) {
    this.pathTraceService = pathTraceService;
  }

  @GetMapping
  public Page<PathTraceResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) PathTraceStatus status,
      Pageable pageable) {
    return pathTraceService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public PathTraceResponse getById(@PathVariable Long id) {
    return pathTraceService.getById(id);
  }

  @PostMapping
  public ResponseEntity<PathTraceResponse> create(
      @Valid @RequestBody PathTraceRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(pathTraceService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public PathTraceResponse update(
      @PathVariable Long id,
      @Valid @RequestBody PathTraceRequest request,
      Authentication authentication) {
    return pathTraceService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    pathTraceService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
