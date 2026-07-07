package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.DeviceRequest;
import com.awb.backend.core.dto.DeviceResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.DeviceSpecifications;
import com.awb.backend.core.repository.RackRepository;
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
public class DeviceService {

  private final DeviceRepository deviceRepository;
  private final RackRepository rackRepository;
  private final AuditLogWriter auditLogWriter;

  public DeviceService(
      DeviceRepository deviceRepository, RackRepository rackRepository, AuditLogWriter auditLogWriter) {
    this.deviceRepository = deviceRepository;
    this.rackRepository = rackRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<DeviceResponse> list(
      String search, DeviceStatus status, Long rackId, Pageable pageable) {
    Specification<Device> spec =
        Specification.where(DeviceSpecifications.notDeleted())
            .and(DeviceSpecifications.search(search))
            .and(DeviceSpecifications.hasStatus(status))
            .and(DeviceSpecifications.hasRackId(rackId));
    return deviceRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public DeviceResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public DeviceResponse create(DeviceRequest request, String actorUsername) {
    if (deviceRepository.existsBySerialNumberIgnoreCase(request.getSerialNumber())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A device with this serial number already exists.");
    }

    Device device = new Device();
    device.setRack(findActiveRackOrThrow(request.getRackId()));
    applyRequest(device, request);
    Instant now = Instant.now();
    device.setCreatedAt(now);
    device.setUpdatedAt(now);
    DeviceResponse response = toResponse(deviceRepository.save(device));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Device", response.getName(), null);
    return response;
  }

  @Transactional
  public DeviceResponse update(Long id, DeviceRequest request, String actorUsername) {
    Device device = findActiveOrThrow(id);
    if (deviceRepository.existsBySerialNumberIgnoreCaseAndIdNot(request.getSerialNumber(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A device with this serial number already exists.");
    }

    device.setRack(findActiveRackOrThrow(request.getRackId()));
    applyRequest(device, request);
    device.setUpdatedAt(Instant.now());
    DeviceResponse response = toResponse(deviceRepository.save(device));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "Device", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    Device device = findActiveOrThrow(id);
    device.setDeleted(true);
    device.setUpdatedAt(Instant.now());
    deviceRepository.save(device);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "Device", device.getName(), null);
  }

  private Device findActiveOrThrow(Long id) {
    Device device =
        deviceRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found."));
    if (device.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found.");
    }
    return device;
  }

  private Rack findActiveRackOrThrow(Long rackId) {
    Rack rack =
        rackRepository
            .findById(rackId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rack not found."));
    if (rack.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rack not found.");
    }
    return rack;
  }

  private void applyRequest(Device device, DeviceRequest request) {
    device.setName(request.getName());
    device.setDeviceType(request.getDeviceType());
    device.setManufacturer(request.getManufacturer());
    device.setModel(request.getModel());
    device.setSerialNumber(request.getSerialNumber());
    device.setPositionUStart(request.getPositionUStart());
    device.setHeightU(request.getHeightU());
    device.setPowerConsumptionW(request.getPowerConsumptionW());
    device.setManagementIp(request.getManagementIp());
    device.setStatus(request.getStatus());
    device.setNotes(request.getNotes());
  }

  private DeviceResponse toResponse(Device device) {
    DeviceResponse response = new DeviceResponse();
    response.setId(device.getId());
    response.setRackId(device.getRack().getId());
    response.setRackName(device.getRack().getName());
    response.setName(device.getName());
    response.setDeviceType(device.getDeviceType());
    response.setManufacturer(device.getManufacturer());
    response.setModel(device.getModel());
    response.setSerialNumber(device.getSerialNumber());
    response.setPositionUStart(device.getPositionUStart());
    response.setHeightU(device.getHeightU());
    response.setPowerConsumptionW(device.getPowerConsumptionW());
    response.setManagementIp(device.getManagementIp());
    response.setStatus(device.getStatus());
    response.setNotes(device.getNotes());
    response.setCreatedAt(device.getCreatedAt());
    response.setUpdatedAt(device.getUpdatedAt());
    return response;
  }
}
