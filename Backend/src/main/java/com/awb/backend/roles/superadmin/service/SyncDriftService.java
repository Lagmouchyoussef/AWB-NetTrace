package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.SyncDriftRequest;
import com.awb.backend.core.dto.SyncDriftResponse;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.SyncDrift;
import com.awb.backend.core.entity.SyncDriftStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.SyncDriftRepository;
import com.awb.backend.core.repository.SyncDriftSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SyncDriftService {

  private final SyncDriftRepository syncDriftRepository;
  private final DeviceRepository deviceRepository;

  public SyncDriftService(
      SyncDriftRepository syncDriftRepository, DeviceRepository deviceRepository) {
    this.syncDriftRepository = syncDriftRepository;
    this.deviceRepository = deviceRepository;
  }

  @Transactional(readOnly = true)
  public Page<SyncDriftResponse> list(
      String search, SyncDriftStatus status, DriftSeverity severity, Pageable pageable) {
    Specification<SyncDrift> spec =
        Specification.where(SyncDriftSpecifications.notDeleted())
            .and(SyncDriftSpecifications.search(search))
            .and(SyncDriftSpecifications.hasStatus(status))
            .and(SyncDriftSpecifications.hasSeverity(severity));
    return syncDriftRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public SyncDriftResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public SyncDriftResponse create(SyncDriftRequest request) {
    SyncDrift drift = new SyncDrift();
    drift.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(drift, request);
    Instant now = Instant.now();
    drift.setCreatedAt(now);
    drift.setUpdatedAt(now);
    return toResponse(syncDriftRepository.save(drift));
  }

  @Transactional
  public SyncDriftResponse update(Long id, SyncDriftRequest request) {
    SyncDrift drift = findActiveOrThrow(id);
    drift.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(drift, request);
    drift.setUpdatedAt(Instant.now());
    return toResponse(syncDriftRepository.save(drift));
  }

  @Transactional
  public void delete(Long id) {
    SyncDrift drift = findActiveOrThrow(id);
    drift.setDeleted(true);
    drift.setUpdatedAt(Instant.now());
    syncDriftRepository.save(drift);
  }

  private SyncDrift findActiveOrThrow(Long id) {
    SyncDrift drift =
        syncDriftRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sync drift not found."));
    if (drift.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sync drift not found.");
    }
    return drift;
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

  private void applyRequest(SyncDrift drift, SyncDriftRequest request) {
    drift.setTitle(request.getTitle());
    drift.setDescription(request.getDescription());
    drift.setDriftType(request.getDriftType());
    drift.setSeverity(request.getSeverity());
    drift.setStatus(request.getStatus());
    drift.setDetectedAt(request.getDetectedAt());
    drift.setRemediatedAt(request.getRemediatedAt());
    drift.setNotes(request.getNotes());
  }

  private SyncDriftResponse toResponse(SyncDrift drift) {
    SyncDriftResponse response = new SyncDriftResponse();
    response.setId(drift.getId());
    response.setDeviceId(drift.getDevice().getId());
    response.setDeviceName(drift.getDevice().getName());
    response.setTitle(drift.getTitle());
    response.setDescription(drift.getDescription());
    response.setDriftType(drift.getDriftType());
    response.setSeverity(drift.getSeverity());
    response.setStatus(drift.getStatus());
    response.setDetectedAt(drift.getDetectedAt());
    response.setRemediatedAt(drift.getRemediatedAt());
    response.setNotes(drift.getNotes());
    response.setCreatedAt(drift.getCreatedAt());
    response.setUpdatedAt(drift.getUpdatedAt());
    return response;
  }
}
