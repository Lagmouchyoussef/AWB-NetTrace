package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.RealTimeDashboardRequest;
import com.awb.backend.core.dto.RealTimeDashboardResponse;
import com.awb.backend.core.entity.RealTimeDashboard;
import com.awb.backend.core.entity.RealTimeDashboardStatus;
import com.awb.backend.core.repository.RealTimeDashboardRepository;
import com.awb.backend.core.repository.RealTimeDashboardSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RealTimeDashboardService {

  private final RealTimeDashboardRepository realTimeDashboardRepository;

  public RealTimeDashboardService(RealTimeDashboardRepository realTimeDashboardRepository) {
    this.realTimeDashboardRepository = realTimeDashboardRepository;
  }

  @Transactional(readOnly = true)
  public Page<RealTimeDashboardResponse> list(
      String search, RealTimeDashboardStatus status, Pageable pageable) {
    Specification<RealTimeDashboard> spec =
        Specification.where(RealTimeDashboardSpecifications.notDeleted())
            .and(RealTimeDashboardSpecifications.search(search))
            .and(RealTimeDashboardSpecifications.hasStatus(status));
    return realTimeDashboardRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public RealTimeDashboardResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public RealTimeDashboardResponse create(RealTimeDashboardRequest request) {
    if (realTimeDashboardRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A dashboard with this code already exists.");
    }

    RealTimeDashboard dashboard = new RealTimeDashboard();
    applyRequest(dashboard, request);
    Instant now = Instant.now();
    dashboard.setCreatedAt(now);
    dashboard.setUpdatedAt(now);
    return toResponse(realTimeDashboardRepository.save(dashboard));
  }

  @Transactional
  public RealTimeDashboardResponse update(Long id, RealTimeDashboardRequest request) {
    RealTimeDashboard dashboard = findActiveOrThrow(id);
    if (realTimeDashboardRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A dashboard with this code already exists.");
    }

    applyRequest(dashboard, request);
    dashboard.setUpdatedAt(Instant.now());
    return toResponse(realTimeDashboardRepository.save(dashboard));
  }

  @Transactional
  public void delete(Long id) {
    RealTimeDashboard dashboard = findActiveOrThrow(id);
    dashboard.setDeleted(true);
    dashboard.setUpdatedAt(Instant.now());
    realTimeDashboardRepository.save(dashboard);
  }

  private RealTimeDashboard findActiveOrThrow(Long id) {
    RealTimeDashboard dashboard =
        realTimeDashboardRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dashboard not found."));
    if (dashboard.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dashboard not found.");
    }
    return dashboard;
  }

  private void applyRequest(RealTimeDashboard dashboard, RealTimeDashboardRequest request) {
    dashboard.setName(request.getName());
    dashboard.setCode(request.getCode());
    dashboard.setDescription(request.getDescription());
    dashboard.setRefreshIntervalSeconds(request.getRefreshIntervalSeconds());
    dashboard.setWidgetCount(request.getWidgetCount());
    dashboard.setStatus(request.getStatus());
    dashboard.setNotes(request.getNotes());
  }

  private RealTimeDashboardResponse toResponse(RealTimeDashboard dashboard) {
    RealTimeDashboardResponse response = new RealTimeDashboardResponse();
    response.setId(dashboard.getId());
    response.setName(dashboard.getName());
    response.setCode(dashboard.getCode());
    response.setDescription(dashboard.getDescription());
    response.setRefreshIntervalSeconds(dashboard.getRefreshIntervalSeconds());
    response.setWidgetCount(dashboard.getWidgetCount());
    response.setStatus(dashboard.getStatus());
    response.setNotes(dashboard.getNotes());
    response.setCreatedAt(dashboard.getCreatedAt());
    response.setUpdatedAt(dashboard.getUpdatedAt());
    return response;
  }
}
