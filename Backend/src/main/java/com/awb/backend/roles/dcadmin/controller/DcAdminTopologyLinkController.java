package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.TopologyLinkRequest;
import com.awb.backend.core.dto.TopologyLinkResponse;
import com.awb.backend.core.entity.TopologyLinkStatus;
import com.awb.backend.roles.superadmin.service.TopologyLinkService;
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

// Delegates entirely to the same TopologyLinkService Super Admin uses, so audit logging and
// live notification broadcasting (AuditLogWriter) is shared automatically.
@RestController
@RequestMapping("/api/roles/dc-admin/topology-links")
public class DcAdminTopologyLinkController {

  private final TopologyLinkService topologyLinkService;

  public DcAdminTopologyLinkController(TopologyLinkService topologyLinkService) {
    this.topologyLinkService = topologyLinkService;
  }

  @GetMapping
  public Page<TopologyLinkResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) TopologyLinkStatus status,
      Pageable pageable) {
    return topologyLinkService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public TopologyLinkResponse getById(@PathVariable Long id) {
    return topologyLinkService.getById(id);
  }

  @PostMapping
  public ResponseEntity<TopologyLinkResponse> create(
      @Valid @RequestBody TopologyLinkRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(topologyLinkService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public TopologyLinkResponse update(
      @PathVariable Long id,
      @Valid @RequestBody TopologyLinkRequest request,
      Authentication authentication) {
    return topologyLinkService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    topologyLinkService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
