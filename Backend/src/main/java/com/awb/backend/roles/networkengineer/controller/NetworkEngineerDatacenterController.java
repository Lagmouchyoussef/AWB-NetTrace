package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.DatacenterRequest;
import com.awb.backend.core.dto.DatacenterResponse;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.DatacenterTier;
import com.awb.backend.roles.superadmin.service.DatacenterService;
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

// Delegates to the same DatacenterService Super Admin uses - see DcAdminDatacenterController.
// Read-only in the Network Engineer frontend (this role places devices, it doesn't create
// sites); write endpoints are left in place rather than removed, matching
// DcAdminEquipmentTypeController's precedent for a read-only-in-UI module.
@RestController
@RequestMapping("/api/roles/network-engineer/datacenters")
public class NetworkEngineerDatacenterController {

  private final DatacenterService datacenterService;

  public NetworkEngineerDatacenterController(DatacenterService datacenterService) {
    this.datacenterService = datacenterService;
  }

  @GetMapping
  public Page<DatacenterResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) DatacenterStatus status,
      @RequestParam(required = false) DatacenterTier tier,
      Pageable pageable) {
    return datacenterService.list(search, status, tier, pageable);
  }

  @GetMapping("/{id}")
  public DatacenterResponse getById(@PathVariable Long id) {
    return datacenterService.getById(id);
  }

  @PostMapping
  public ResponseEntity<DatacenterResponse> create(
      @Valid @RequestBody DatacenterRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(datacenterService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public DatacenterResponse update(
      @PathVariable Long id,
      @Valid @RequestBody DatacenterRequest request,
      Authentication authentication) {
    return datacenterService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    datacenterService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
