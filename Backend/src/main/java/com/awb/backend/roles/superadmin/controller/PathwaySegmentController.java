package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.PathwaySegmentRequest;
import com.awb.backend.core.dto.PathwaySegmentResponse;
import com.awb.backend.roles.superadmin.service.PathwaySegmentService;
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
@RequestMapping("/api/roles/super-admin/pathway-segments")
public class PathwaySegmentController {

  private final PathwaySegmentService pathwaySegmentService;

  public PathwaySegmentController(PathwaySegmentService pathwaySegmentService) {
    this.pathwaySegmentService = pathwaySegmentService;
  }

  @GetMapping
  public Page<PathwaySegmentResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) Long pathwayId,
      Pageable pageable) {
    return pathwaySegmentService.list(search, pathwayId, pageable);
  }

  @GetMapping("/{id}")
  public PathwaySegmentResponse getById(@PathVariable Long id) {
    return pathwaySegmentService.getById(id);
  }

  @PostMapping
  public ResponseEntity<PathwaySegmentResponse> create(
      @Valid @RequestBody PathwaySegmentRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(pathwaySegmentService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public PathwaySegmentResponse update(
      @PathVariable Long id,
      @Valid @RequestBody PathwaySegmentRequest request,
      Authentication authentication) {
    return pathwaySegmentService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    pathwaySegmentService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
