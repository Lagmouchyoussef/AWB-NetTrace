package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.OverlayTunnelRequest;
import com.awb.backend.core.dto.OverlayTunnelResponse;
import com.awb.backend.core.entity.OverlayTunnelStatus;
import com.awb.backend.roles.superadmin.service.OverlayTunnelService;
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

// Delegates to the same OverlayTunnelService Super Admin uses. No delete endpoint - decommission
// via status (DOWN is the closest equivalent; this entity has no DECOMMISSIONED value).
@RestController
@RequestMapping("/api/roles/network-engineer/overlay-tunnels")
public class NetworkEngineerOverlayTunnelController {

  private final OverlayTunnelService overlayTunnelService;

  public NetworkEngineerOverlayTunnelController(OverlayTunnelService overlayTunnelService) {
    this.overlayTunnelService = overlayTunnelService;
  }

  @GetMapping
  public Page<OverlayTunnelResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) OverlayTunnelStatus status,
      Pageable pageable) {
    return overlayTunnelService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public OverlayTunnelResponse getById(@PathVariable Long id) {
    return overlayTunnelService.getById(id);
  }

  @PostMapping
  public ResponseEntity<OverlayTunnelResponse> create(
      @Valid @RequestBody OverlayTunnelRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(overlayTunnelService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public OverlayTunnelResponse update(
      @PathVariable Long id,
      @Valid @RequestBody OverlayTunnelRequest request,
      Authentication authentication) {
    return overlayTunnelService.update(id, request, authentication.getName());
  }
}
