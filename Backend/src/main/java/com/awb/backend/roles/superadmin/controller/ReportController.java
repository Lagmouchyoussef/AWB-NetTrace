package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.ReportRequest;
import com.awb.backend.core.dto.ReportResponse;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import com.awb.backend.roles.superadmin.service.ReportService;
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
@RequestMapping("/api/roles/super-admin/reports")
public class ReportController {

  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping
  public Page<ReportResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) ReportStatus status,
      @RequestParam(required = false) ReportType reportType,
      Pageable pageable) {
    return reportService.list(search, status, reportType, pageable);
  }

  @GetMapping("/{id}")
  public ReportResponse getById(@PathVariable Long id) {
    return reportService.getById(id);
  }

  @PostMapping
  public ResponseEntity<ReportResponse> create(
      @Valid @RequestBody ReportRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(reportService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public ReportResponse update(
      @PathVariable Long id,
      @Valid @RequestBody ReportRequest request,
      Authentication authentication) {
    return reportService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    reportService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
