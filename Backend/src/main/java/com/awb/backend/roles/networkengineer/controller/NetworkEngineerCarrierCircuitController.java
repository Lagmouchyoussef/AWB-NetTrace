package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.CarrierCircuitRequest;
import com.awb.backend.core.dto.CarrierCircuitResponse;
import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.roles.superadmin.service.CarrierCircuitService;
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

// Delegates to the same CarrierCircuitService Super Admin uses. No delete endpoint -
// decommission via status.
@RestController
@RequestMapping("/api/roles/network-engineer/carrier-circuits")
public class NetworkEngineerCarrierCircuitController {

  private final CarrierCircuitService carrierCircuitService;

  public NetworkEngineerCarrierCircuitController(CarrierCircuitService carrierCircuitService) {
    this.carrierCircuitService = carrierCircuitService;
  }

  @GetMapping
  public Page<CarrierCircuitResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) CarrierCircuitStatus status,
      @RequestParam(required = false) Long connectorId,
      Pageable pageable) {
    return carrierCircuitService.list(search, status, connectorId, pageable);
  }

  @GetMapping("/{id}")
  public CarrierCircuitResponse getById(@PathVariable Long id) {
    return carrierCircuitService.getById(id);
  }

  @PostMapping
  public ResponseEntity<CarrierCircuitResponse> create(
      @Valid @RequestBody CarrierCircuitRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(carrierCircuitService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public CarrierCircuitResponse update(
      @PathVariable Long id,
      @Valid @RequestBody CarrierCircuitRequest request,
      Authentication authentication) {
    return carrierCircuitService.update(id, request, authentication.getName());
  }
}
