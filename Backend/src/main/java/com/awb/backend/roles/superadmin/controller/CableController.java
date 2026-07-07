package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.CableRequest;
import com.awb.backend.core.dto.CableResponse;
import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.roles.superadmin.service.CableService;
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
@RequestMapping("/api/roles/super-admin/cables")
public class CableController {

  private final CableService cableService;

  public CableController(CableService cableService) {
    this.cableService = cableService;
  }

  @GetMapping
  public Page<CableResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) CableStatus status,
      Pageable pageable) {
    return cableService.list(search, status, pageable);
  }

  @GetMapping("/{id}")
  public CableResponse getById(@PathVariable Long id) {
    return cableService.getById(id);
  }

  @PostMapping
  public ResponseEntity<CableResponse> create(
      @Valid @RequestBody CableRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(cableService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public CableResponse update(
      @PathVariable Long id, @Valid @RequestBody CableRequest request, Authentication authentication) {
    return cableService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    cableService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
