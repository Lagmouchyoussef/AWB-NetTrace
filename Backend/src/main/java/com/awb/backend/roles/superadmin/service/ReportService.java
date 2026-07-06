package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.ReportRequest;
import com.awb.backend.core.dto.ReportResponse;
import com.awb.backend.core.entity.Report;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import com.awb.backend.core.repository.ReportRepository;
import com.awb.backend.core.repository.ReportSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReportService {

  private final ReportRepository reportRepository;

  public ReportService(ReportRepository reportRepository) {
    this.reportRepository = reportRepository;
  }

  @Transactional(readOnly = true)
  public Page<ReportResponse> list(
      String search, ReportStatus status, ReportType reportType, Pageable pageable) {
    Specification<Report> spec =
        Specification.where(ReportSpecifications.notDeleted())
            .and(ReportSpecifications.search(search))
            .and(ReportSpecifications.hasStatus(status))
            .and(ReportSpecifications.hasReportType(reportType));
    return reportRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public ReportResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public ReportResponse create(ReportRequest request) {
    if (reportRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A report with this code already exists.");
    }

    Report report = new Report();
    applyRequest(report, request);
    Instant now = Instant.now();
    report.setCreatedAt(now);
    report.setUpdatedAt(now);
    return toResponse(reportRepository.save(report));
  }

  @Transactional
  public ReportResponse update(Long id, ReportRequest request) {
    Report report = findActiveOrThrow(id);
    if (reportRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A report with this code already exists.");
    }

    applyRequest(report, request);
    report.setUpdatedAt(Instant.now());
    return toResponse(reportRepository.save(report));
  }

  @Transactional
  public void delete(Long id) {
    Report report = findActiveOrThrow(id);
    report.setDeleted(true);
    report.setUpdatedAt(Instant.now());
    reportRepository.save(report);
  }

  private Report findActiveOrThrow(Long id) {
    Report report =
        reportRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found."));
    if (report.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found.");
    }
    return report;
  }

  private void applyRequest(Report report, ReportRequest request) {
    report.setName(request.getName());
    report.setCode(request.getCode());
    report.setReportType(request.getReportType());
    report.setFormat(request.getFormat());
    report.setSchedule(request.getSchedule());
    report.setStatus(request.getStatus());
    report.setLastGeneratedAt(request.getLastGeneratedAt());
    report.setDescription(request.getDescription());
    report.setNotes(request.getNotes());
  }

  private ReportResponse toResponse(Report report) {
    ReportResponse response = new ReportResponse();
    response.setId(report.getId());
    response.setName(report.getName());
    response.setCode(report.getCode());
    response.setReportType(report.getReportType());
    response.setFormat(report.getFormat());
    response.setSchedule(report.getSchedule());
    response.setStatus(report.getStatus());
    response.setLastGeneratedAt(report.getLastGeneratedAt());
    response.setDescription(report.getDescription());
    response.setNotes(report.getNotes());
    response.setCreatedAt(report.getCreatedAt());
    response.setUpdatedAt(report.getUpdatedAt());
    return response;
  }
}
