package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.OverlayNetworkRequest;
import com.awb.backend.core.dto.OverlayNetworkResponse;
import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.roles.superadmin.service.OverlayNetworkService;
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

// Delegates to the same OverlayNetworkService Super Admin uses. No delete endpoint - decommission
// via status.
@RestController
@RequestMapping("/api/roles/network-engineer/overlay-networks")
public class NetworkEngineerOverlayNetworkController {

  private final OverlayNetworkService overlayNetworkService;

  public NetworkEngineerOverlayNetworkController(OverlayNetworkService overlayNetworkService) {
    this.overlayNetworkService = overlayNetworkService;
  }

  @GetMapping
  public Page<OverlayNetworkResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) OverlayNetworkStatus status,
      @RequestParam(required = false) Long datacenterId,
      Pageable pageable) {
    return overlayNetworkService.list(search, status, datacenterId, pageable);
  }

  @GetMapping("/{id}")
  public OverlayNetworkResponse getById(@PathVariable Long id) {
    return overlayNetworkService.getById(id);
  }

  @PostMapping
  public ResponseEntity<OverlayNetworkResponse> create(
      @Valid @RequestBody OverlayNetworkRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(overlayNetworkService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public OverlayNetworkResponse update(
      @PathVariable Long id,
      @Valid @RequestBody OverlayNetworkRequest request,
      Authentication authentication) {
    return overlayNetworkService.update(id, request, authentication.getName());
  }
}
