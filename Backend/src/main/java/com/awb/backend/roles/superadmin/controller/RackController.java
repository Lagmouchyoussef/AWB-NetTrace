package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.RackRequest;
import com.awb.backend.core.dto.RackResponse;
import com.awb.backend.core.entity.RackStatus;
import com.awb.backend.roles.superadmin.service.RackService;
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

@RestController
@RequestMapping("/api/roles/super-admin/racks")
public class RackController {

  private final RackService rackService;

  public RackController(RackService rackService) {
    this.rackService = rackService;
  }

  @GetMapping
  public Page<RackResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) RackStatus status,
      @RequestParam(required = false) Long roomId,
      Pageable pageable) {
    return rackService.list(search, status, roomId, pageable);
  }

  @GetMapping("/{id}")
  public RackResponse getById(@PathVariable Long id) {
    return rackService.getById(id);
  }

  @PostMapping
  public ResponseEntity<RackResponse> create(
      @Valid @RequestBody RackRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(rackService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public RackResponse update(
      @PathVariable Long id,
      @Valid @RequestBody RackRequest request,
      Authentication authentication) {
    return rackService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    rackService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
