package com.awb.backend.roles.requester.controller;

import com.awb.backend.core.dto.DeviceResponse;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.roles.superadmin.service.DeviceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Read-only, delegates to the same DeviceService Super Admin uses - Requester only ever needs
// this for the device picker on its own "My Requests" creation form (see
// RequesterInterventionController), never to manage devices themselves. Mirrors
// ApproverDeviceController exactly.
@RestController
@RequestMapping("/api/roles/requester/devices")
public class RequesterDeviceController {

  private final DeviceService deviceService;

  public RequesterDeviceController(DeviceService deviceService) {
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
}
