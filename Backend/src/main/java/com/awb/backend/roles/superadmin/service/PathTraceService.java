package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.PathTraceRequest;
import com.awb.backend.core.dto.PathTraceResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.PathTrace;
import com.awb.backend.core.entity.PathTraceStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.PathTraceRepository;
import com.awb.backend.core.repository.PathTraceSpecifications;
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
public class PathTraceService {

  private final PathTraceRepository pathTraceRepository;
  private final DeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  public PathTraceService(
      PathTraceRepository pathTraceRepository,
      DeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    this.pathTraceRepository = pathTraceRepository;
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<PathTraceResponse> list(String search, PathTraceStatus status, Pageable pageable) {
    Specification<PathTrace> spec =
        Specification.where(PathTraceSpecifications.notDeleted())
            .and(PathTraceSpecifications.search(search))
            .and(PathTraceSpecifications.hasStatus(status));
    return pathTraceRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public PathTraceResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public PathTraceResponse create(PathTraceRequest request, String actorUsername) {
    if (pathTraceRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A path trace with this code already exists.");
    }
    validateEndpoints(request.getSourceDeviceId(), request.getTargetDeviceId());

    PathTrace pathTrace = new PathTrace();
    pathTrace.setSourceDevice(findActiveDeviceOrThrow(request.getSourceDeviceId()));
    pathTrace.setTargetDevice(findActiveDeviceOrThrow(request.getTargetDeviceId()));
    applyRequest(pathTrace, request);
    Instant now = Instant.now();
    pathTrace.setCreatedAt(now);
    pathTrace.setUpdatedAt(now);
    PathTraceResponse response = toResponse(pathTraceRepository.save(pathTrace));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "PathTrace", response.getName(), null);
    return response;
  }

  @Transactional
  public PathTraceResponse update(Long id, PathTraceRequest request, String actorUsername) {
    PathTrace pathTrace = findActiveOrThrow(id);
    if (pathTraceRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A path trace with this code already exists.");
    }
    validateEndpoints(request.getSourceDeviceId(), request.getTargetDeviceId());

    pathTrace.setSourceDevice(findActiveDeviceOrThrow(request.getSourceDeviceId()));
    pathTrace.setTargetDevice(findActiveDeviceOrThrow(request.getTargetDeviceId()));
    applyRequest(pathTrace, request);
    pathTrace.setUpdatedAt(Instant.now());
    PathTraceResponse response = toResponse(pathTraceRepository.save(pathTrace));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "PathTrace", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    PathTrace pathTrace = findActiveOrThrow(id);
    pathTrace.setDeleted(true);
    pathTrace.setUpdatedAt(Instant.now());
    pathTraceRepository.save(pathTrace);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "PathTrace", pathTrace.getName(), null);
  }

  private void validateEndpoints(Long sourceDeviceId, Long targetDeviceId) {
    if (sourceDeviceId.equals(targetDeviceId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A path trace cannot connect a device to itself.");
    }
  }

  private PathTrace findActiveOrThrow(Long id) {
    PathTrace pathTrace =
        pathTraceRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Path trace not found."));
    if (pathTrace.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Path trace not found.");
    }
    return pathTrace;
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

  private void applyRequest(PathTrace pathTrace, PathTraceRequest request) {
    pathTrace.setName(request.getName());
    pathTrace.setCode(request.getCode());
    pathTrace.setHopCount(request.getHopCount());
    pathTrace.setTotalLengthMeters(request.getTotalLengthMeters());
    pathTrace.setStatus(request.getStatus());
    pathTrace.setTracedAt(request.getTracedAt());
    pathTrace.setNotes(request.getNotes());
  }

  private PathTraceResponse toResponse(PathTrace pathTrace) {
    PathTraceResponse response = new PathTraceResponse();
    response.setId(pathTrace.getId());
    response.setName(pathTrace.getName());
    response.setCode(pathTrace.getCode());
    response.setSourceDeviceId(pathTrace.getSourceDevice().getId());
    response.setSourceDeviceName(pathTrace.getSourceDevice().getName());
    response.setTargetDeviceId(pathTrace.getTargetDevice().getId());
    response.setTargetDeviceName(pathTrace.getTargetDevice().getName());
    response.setHopCount(pathTrace.getHopCount());
    response.setTotalLengthMeters(pathTrace.getTotalLengthMeters());
    response.setStatus(pathTrace.getStatus());
    response.setTracedAt(pathTrace.getTracedAt());
    response.setNotes(pathTrace.getNotes());
    response.setCreatedAt(pathTrace.getCreatedAt());
    response.setUpdatedAt(pathTrace.getUpdatedAt());
    return response;
  }
}
