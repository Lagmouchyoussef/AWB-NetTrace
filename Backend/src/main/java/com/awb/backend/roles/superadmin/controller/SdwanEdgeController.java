package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.SdwanEdgeRequest;
import com.awb.backend.core.dto.SdwanEdgeResponse;
import com.awb.backend.core.entity.SdwanEdgeStatus;
import com.awb.backend.roles.superadmin.service.SdwanEdgeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/sdwan-edges")
public class SdwanEdgeController {

  private final SdwanEdgeService sdwanEdgeService;

  public SdwanEdgeController(SdwanEdgeService sdwanEdgeService) {
    this.sdwanEdgeService = sdwanEdgeService;
  }

  @GetMapping
  public Page<SdwanEdgeResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) SdwanEdgeStatus status,
      @RequestParam(required = false) Long datacenterId,
      Pageable pageable) {
    return sdwanEdgeService.list(search, status, datacenterId, pageable);
  }

  @GetMapping("/{id}")
  public SdwanEdgeResponse getById(@PathVariable Long id) {
    return sdwanEdgeService.getById(id);
  }

  @PostMapping
  public ResponseEntity<SdwanEdgeResponse> create(@Valid @RequestBody SdwanEdgeRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(sdwanEdgeService.create(request));
  }

  @PutMapping("/{id}")
  public SdwanEdgeResponse update(
      @PathVariable Long id, @Valid @RequestBody SdwanEdgeRequest request) {
    return sdwanEdgeService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    sdwanEdgeService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
