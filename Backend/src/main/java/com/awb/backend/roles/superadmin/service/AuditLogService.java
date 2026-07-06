package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.AuditLogRequest;
import com.awb.backend.core.dto.AuditLogResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.AuditLog;
import com.awb.backend.core.repository.AuditLogRepository;
import com.awb.backend.core.repository.AuditLogSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;

  public AuditLogService(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  @Transactional(readOnly = true)
  public Page<AuditLogResponse> list(String search, AuditAction action, Pageable pageable) {
    Specification<AuditLog> spec =
        Specification.where(AuditLogSpecifications.notDeleted())
            .and(AuditLogSpecifications.search(search))
            .and(AuditLogSpecifications.hasAction(action));
    return auditLogRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public AuditLogResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public AuditLogResponse create(AuditLogRequest request) {
    AuditLog log = new AuditLog();
    applyRequest(log, request);
    Instant now = Instant.now();
    log.setCreatedAt(now);
    log.setUpdatedAt(now);
    return toResponse(auditLogRepository.save(log));
  }

  @Transactional
  public AuditLogResponse update(Long id, AuditLogRequest request) {
    AuditLog log = findActiveOrThrow(id);
    applyRequest(log, request);
    log.setUpdatedAt(Instant.now());
    return toResponse(auditLogRepository.save(log));
  }

  @Transactional
  public void delete(Long id) {
    AuditLog log = findActiveOrThrow(id);
    log.setDeleted(true);
    log.setUpdatedAt(Instant.now());
    auditLogRepository.save(log);
  }

  private AuditLog findActiveOrThrow(Long id) {
    AuditLog log =
        auditLogRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Audit log not found."));
    if (log.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audit log not found.");
    }
    return log;
  }

  private void applyRequest(AuditLog log, AuditLogRequest request) {
    log.setActorUsername(request.getActorUsername());
    log.setAction(request.getAction());
    log.setEntityType(request.getEntityType());
    log.setEntityReference(request.getEntityReference());
    log.setDescription(request.getDescription());
    log.setIpAddress(request.getIpAddress());
    log.setOccurredAt(request.getOccurredAt());
    log.setNotes(request.getNotes());
  }

  private AuditLogResponse toResponse(AuditLog log) {
    AuditLogResponse response = new AuditLogResponse();
    response.setId(log.getId());
    response.setActorUsername(log.getActorUsername());
    response.setAction(log.getAction());
    response.setEntityType(log.getEntityType());
    response.setEntityReference(log.getEntityReference());
    response.setDescription(log.getDescription());
    response.setIpAddress(log.getIpAddress());
    response.setOccurredAt(log.getOccurredAt());
    response.setNotes(log.getNotes());
    response.setCreatedAt(log.getCreatedAt());
    response.setUpdatedAt(log.getUpdatedAt());
    return response;
  }
}
