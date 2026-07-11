package com.awb.backend.roles.auditor.controller;

import com.awb.backend.core.dto.ReportResponse;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import com.awb.backend.roles.superadmin.service.ReportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Read-only view of the report-definition registry (see ReportService - this catalogs report
// metadata, it doesn't generate files). GET mappings only, same rationale as
// AuditorAuditLogController.
@RestController
@RequestMapping("/api/roles/auditor/reports")
public class AuditorReportController {

  private final ReportService reportService;

  public AuditorReportController(ReportService reportService) {
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
}
