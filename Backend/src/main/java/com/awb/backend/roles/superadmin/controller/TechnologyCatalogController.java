package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.TechnologyCatalogRequest;
import com.awb.backend.core.dto.TechnologyCatalogResponse;
import com.awb.backend.core.entity.TechnologyCatalogStatus;
import com.awb.backend.core.entity.TechnologyCategory;
import com.awb.backend.roles.superadmin.service.TechnologyCatalogService;
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
@RequestMapping("/api/roles/super-admin/technology-catalog")
public class TechnologyCatalogController {

  private final TechnologyCatalogService technologyCatalogService;

  public TechnologyCatalogController(TechnologyCatalogService technologyCatalogService) {
    this.technologyCatalogService = technologyCatalogService;
  }

  @GetMapping
  public Page<TechnologyCatalogResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) TechnologyCatalogStatus status,
      @RequestParam(required = false) TechnologyCategory category,
      Pageable pageable) {
    return technologyCatalogService.list(search, status, category, pageable);
  }

  @GetMapping("/{id}")
  public TechnologyCatalogResponse getById(@PathVariable Long id) {
    return technologyCatalogService.getById(id);
  }

  @PostMapping
  public ResponseEntity<TechnologyCatalogResponse> create(
      @Valid @RequestBody TechnologyCatalogRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(technologyCatalogService.create(request));
  }

  @PutMapping("/{id}")
  public TechnologyCatalogResponse update(
      @PathVariable Long id, @Valid @RequestBody TechnologyCatalogRequest request) {
    return technologyCatalogService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    technologyCatalogService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
