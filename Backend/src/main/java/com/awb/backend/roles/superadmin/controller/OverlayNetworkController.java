package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.OverlayNetworkResponse;
import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.roles.superadmin.service.OverlayNetworkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Read-only: overlay networks (VXLAN/EVPN) are viewed here, not managed.
@RestController
@RequestMapping("/api/roles/super-admin/overlay-networks")
public class OverlayNetworkController {

  private final OverlayNetworkService overlayNetworkService;

  public OverlayNetworkController(OverlayNetworkService overlayNetworkService) {
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
}
