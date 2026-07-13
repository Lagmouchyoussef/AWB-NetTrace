package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.PathwayRequest;
import com.awb.backend.core.dto.PathwayResponse;
import com.awb.backend.core.entity.PathwayStatus;
import com.awb.backend.core.entity.PathwayType;
import com.awb.backend.roles.superadmin.service.PathwayService;
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

// Delegates entirely to the same PathwayService Super Admin uses, so audit logging and live
// notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/pathways")
public class DcAdminPathwayController {

  private final PathwayService pathwayService;

  public DcAdminPathwayController(PathwayService pathwayService) {
    this.pathwayService = pathwayService;
  }

  @GetMapping
  public Page<PathwayResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) PathwayStatus status,
      @RequestParam(required = false) PathwayType type,
      @RequestParam(required = false) Long datacenterId,
      Pageable pageable) {
    return pathwayService.list(search, status, type, datacenterId, pageable);
  }

  @GetMapping("/{id}")
  public PathwayResponse getById(@PathVariable Long id) {
    return pathwayService.getById(id);
  }

  @PostMapping
  public ResponseEntity<PathwayResponse> create(
      @Valid @RequestBody PathwayRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(pathwayService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public PathwayResponse update(
      @PathVariable Long id,
      @Valid @RequestBody PathwayRequest request,
      Authentication authentication) {
    return pathwayService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    pathwayService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
