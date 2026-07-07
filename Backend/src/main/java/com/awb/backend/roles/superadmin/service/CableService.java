package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.CableRequest;
import com.awb.backend.core.dto.CableResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Cable;
import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.CableRepository;
import com.awb.backend.core.repository.CableSpecifications;
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
public class CableService {

  private final CableRepository cableRepository;
  private final DeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  public CableService(
      CableRepository cableRepository,
      DeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    this.cableRepository = cableRepository;
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<CableResponse> list(String search, CableStatus status, Pageable pageable) {
    Specification<Cable> spec =
        Specification.where(CableSpecifications.notDeleted())
            .and(CableSpecifications.search(search))
            .and(CableSpecifications.hasStatus(status));
    return cableRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public CableResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public CableResponse create(CableRequest request, String actorUsername) {
    if (cableRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A cable with this code already exists.");
    }
    validateEndpoints(request.getSourceDeviceId(), request.getTargetDeviceId());

    Cable cable = new Cable();
    cable.setSourceDevice(findActiveDeviceOrThrow(request.getSourceDeviceId()));
    cable.setTargetDevice(findActiveDeviceOrThrow(request.getTargetDeviceId()));
    applyRequest(cable, request);
    Instant now = Instant.now();
    cable.setCreatedAt(now);
    cable.setUpdatedAt(now);
    CableResponse response = toResponse(cableRepository.save(cable));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Cable", response.getName(), null);
    return response;
  }

  @Transactional
  public CableResponse update(Long id, CableRequest request, String actorUsername) {
    Cable cable = findActiveOrThrow(id);
    if (cableRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A cable with this code already exists.");
    }
    validateEndpoints(request.getSourceDeviceId(), request.getTargetDeviceId());

    cable.setSourceDevice(findActiveDeviceOrThrow(request.getSourceDeviceId()));
    cable.setTargetDevice(findActiveDeviceOrThrow(request.getTargetDeviceId()));
    applyRequest(cable, request);
    cable.setUpdatedAt(Instant.now());
    CableResponse response = toResponse(cableRepository.save(cable));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "Cable", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    Cable cable = findActiveOrThrow(id);
    cable.setDeleted(true);
    cable.setUpdatedAt(Instant.now());
    cableRepository.save(cable);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "Cable", cable.getName(), null);
  }

  private void validateEndpoints(Long sourceDeviceId, Long targetDeviceId) {
    if (sourceDeviceId.equals(targetDeviceId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A cable cannot connect a device to itself.");
    }
  }

  private Cable findActiveOrThrow(Long id) {
    Cable cable =
        cableRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cable not found."));
    if (cable.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cable not found.");
    }
    return cable;
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

  private void applyRequest(Cable cable, CableRequest request) {
    cable.setName(request.getName());
    cable.setCode(request.getCode());
    cable.setCableType(request.getCableType());
    cable.setLengthMeters(request.getLengthMeters());
    cable.setStatus(request.getStatus());
    cable.setNotes(request.getNotes());
  }

  private CableResponse toResponse(Cable cable) {
    CableResponse response = new CableResponse();
    response.setId(cable.getId());
    response.setName(cable.getName());
    response.setCode(cable.getCode());
    response.setSourceDeviceId(cable.getSourceDevice().getId());
    response.setSourceDeviceName(cable.getSourceDevice().getName());
    response.setTargetDeviceId(cable.getTargetDevice().getId());
    response.setTargetDeviceName(cable.getTargetDevice().getName());
    response.setCableType(cable.getCableType());
    response.setLengthMeters(cable.getLengthMeters());
    response.setStatus(cable.getStatus());
    response.setNotes(cable.getNotes());
    response.setCreatedAt(cable.getCreatedAt());
    response.setUpdatedAt(cable.getUpdatedAt());
    return response;
  }
}
