package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.AnomalyDetectionRequest;
import com.awb.backend.core.dto.AnomalyDetectionResponse;
import com.awb.backend.core.entity.AnomalyDetection;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.AnomalyDetectionRepository;
import com.awb.backend.core.repository.AnomalyDetectionSpecifications;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.util.AuditLogWriter;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AnomalyDetectionService {

  private final AnomalyDetectionRepository anomalyDetectionRepository;
  private final DeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  public AnomalyDetectionService(
      AnomalyDetectionRepository anomalyDetectionRepository,
      DeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    this.anomalyDetectionRepository = anomalyDetectionRepository;
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<AnomalyDetectionResponse> list(
      String search, AnomalyDetectionStatus status, AnomalySeverity severity, Pageable pageable) {
    Specification<AnomalyDetection> spec =
        Specification.where(AnomalyDetectionSpecifications.notDeleted())
            .and(AnomalyDetectionSpecifications.search(search))
            .and(AnomalyDetectionSpecifications.hasStatus(status))
            .and(AnomalyDetectionSpecifications.hasSeverity(severity));
    return anomalyDetectionRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public AnomalyDetectionResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public AnomalyDetectionResponse create(AnomalyDetectionRequest request, String actorUsername) {
    AnomalyDetection anomaly = new AnomalyDetection();
    anomaly.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(anomaly, request);
    Instant now = Instant.now();
    anomaly.setCreatedAt(now);
    anomaly.setUpdatedAt(now);
    AnomalyDetectionResponse response = toResponse(anomalyDetectionRepository.save(anomaly));
    auditLogWriter.log(
        actorUsername, AuditAction.CREATE, "AnomalyDetection", response.getTitle(), null);
    return response;
  }

  @Transactional
  public AnomalyDetectionResponse update(
      Long id, AnomalyDetectionRequest request, String actorUsername) {
    AnomalyDetection anomaly = findActiveOrThrow(id);
    anomaly.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(anomaly, request);
    anomaly.setUpdatedAt(Instant.now());
    AnomalyDetectionResponse response = toResponse(anomalyDetectionRepository.save(anomaly));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "AnomalyDetection", response.getTitle(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    AnomalyDetection anomaly = findActiveOrThrow(id);
    anomaly.setDeleted(true);
    anomaly.setUpdatedAt(Instant.now());
    anomalyDetectionRepository.save(anomaly);
    auditLogWriter.log(
        actorUsername, AuditAction.DELETE, "AnomalyDetection", anomaly.getTitle(), null);
  }

  private AnomalyDetection findActiveOrThrow(Long id) {
    AnomalyDetection anomaly =
        anomalyDetectionRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Anomaly not found."));
    if (anomaly.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Anomaly not found.");
    }
    return anomaly;
  }

  private Device findActiveDeviceOrThrow(Long deviceId) {
    Device device =
        deviceRepository
            .findById(deviceId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found."));
    if (device.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found.");
    }
    return device;
  }

  private void applyRequest(AnomalyDetection anomaly, AnomalyDetectionRequest request) {
    anomaly.setTitle(request.getTitle());
    anomaly.setDescription(request.getDescription());
    anomaly.setAnomalyType(request.getAnomalyType());
    anomaly.setSeverity(request.getSeverity());
    anomaly.setStatus(request.getStatus());
    anomaly.setDetectedAt(request.getDetectedAt());
    anomaly.setResolvedAt(request.getResolvedAt());
    anomaly.setNotes(request.getNotes());
  }

  private AnomalyDetectionResponse toResponse(AnomalyDetection anomaly) {
    AnomalyDetectionResponse response = new AnomalyDetectionResponse();
    response.setId(anomaly.getId());
    response.setDeviceId(anomaly.getDevice().getId());
    response.setDeviceName(anomaly.getDevice().getName());
    response.setTitle(anomaly.getTitle());
    response.setDescription(anomaly.getDescription());
    response.setAnomalyType(anomaly.getAnomalyType());
    response.setSeverity(anomaly.getSeverity());
    response.setStatus(anomaly.getStatus());
    response.setDetectedAt(anomaly.getDetectedAt());
    response.setResolvedAt(anomaly.getResolvedAt());
    response.setNotes(anomaly.getNotes());
    response.setCreatedAt(anomaly.getCreatedAt());
    response.setUpdatedAt(anomaly.getUpdatedAt());
    return response;
  }
}
