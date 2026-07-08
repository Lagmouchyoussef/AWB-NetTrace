package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.DeviceRequest;
import com.awb.backend.core.dto.DeviceResponse;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.roles.superadmin.service.DeviceService;
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

// Delegates to the same DeviceService Super Admin uses - see DcAdminDatacenterController.
@RestController
@RequestMapping("/api/roles/dc-admin/devices")
public class DcAdminDeviceController {

  private final DeviceService deviceService;

  public DcAdminDeviceController(DeviceService deviceService) {
    this.deviceService = deviceService;
  }

  @GetMapping
  public Page<DeviceResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) DeviceStatus status,
      @RequestParam(required = false) Long rackId,
      Pageable pageable) {
    return deviceService.list(search, status, rackId, pageable);
  }

  @GetMapping("/{id}")
  public DeviceResponse getById(@PathVariable Long id) {
    return deviceService.getById(id);
  }

  @PostMapping
  public ResponseEntity<DeviceResponse> create(
      @Valid @RequestBody DeviceRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(deviceService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public DeviceResponse update(
      @PathVariable Long id,
      @Valid @RequestBody DeviceRequest request,
      Authentication authentication) {
    return deviceService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    deviceService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
