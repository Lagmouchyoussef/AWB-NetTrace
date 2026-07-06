package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.TelemetryConnectorRequest;
import com.awb.backend.core.dto.TelemetryConnectorResponse;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.TelemetryConnector;
import com.awb.backend.core.entity.TelemetryConnectorStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.TelemetryConnectorRepository;
import com.awb.backend.core.repository.TelemetryConnectorSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TelemetryConnectorService {

  private final TelemetryConnectorRepository telemetryConnectorRepository;
  private final DeviceRepository deviceRepository;

  public TelemetryConnectorService(
      TelemetryConnectorRepository telemetryConnectorRepository,
      DeviceRepository deviceRepository) {
    this.telemetryConnectorRepository = telemetryConnectorRepository;
    this.deviceRepository = deviceRepository;
  }

  @Transactional(readOnly = true)
  public Page<TelemetryConnectorResponse> list(
      String search, TelemetryConnectorStatus status, Pageable pageable) {
    Specification<TelemetryConnector> spec =
        Specification.where(TelemetryConnectorSpecifications.notDeleted())
            .and(TelemetryConnectorSpecifications.search(search))
            .and(TelemetryConnectorSpecifications.hasStatus(status));
    return telemetryConnectorRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public TelemetryConnectorResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public TelemetryConnectorResponse create(TelemetryConnectorRequest request) {
    if (telemetryConnectorRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A telemetry connector with this code already exists.");
    }

    TelemetryConnector connector = new TelemetryConnector();
    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    Instant now = Instant.now();
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    return toResponse(telemetryConnectorRepository.save(connector));
  }

  @Transactional
  public TelemetryConnectorResponse update(Long id, TelemetryConnectorRequest request) {
    TelemetryConnector connector = findActiveOrThrow(id);
    if (telemetryConnectorRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A telemetry connector with this code already exists.");
    }

    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    connector.setUpdatedAt(Instant.now());
    return toResponse(telemetryConnectorRepository.save(connector));
  }

  @Transactional
  public void delete(Long id) {
    TelemetryConnector connector = findActiveOrThrow(id);
    connector.setDeleted(true);
    connector.setUpdatedAt(Instant.now());
    telemetryConnectorRepository.save(connector);
  }

  private TelemetryConnector findActiveOrThrow(Long id) {
    TelemetryConnector connector =
        telemetryConnectorRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Telemetry connector not found."));
    if (connector.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Telemetry connector not found.");
    }
    return connector;
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

  private void applyRequest(TelemetryConnector connector, TelemetryConnectorRequest request) {
    connector.setName(request.getName());
    connector.setCode(request.getCode());
    connector.setProtocol(request.getProtocol());
    connector.setPollIntervalSeconds(request.getPollIntervalSeconds());
    connector.setStatus(request.getStatus());
    connector.setLastPolledAt(request.getLastPolledAt());
    connector.setNotes(request.getNotes());
  }

  private TelemetryConnectorResponse toResponse(TelemetryConnector connector) {
    TelemetryConnectorResponse response = new TelemetryConnectorResponse();
    response.setId(connector.getId());
    response.setDeviceId(connector.getDevice().getId());
    response.setDeviceName(connector.getDevice().getName());
    response.setName(connector.getName());
    response.setCode(connector.getCode());
    response.setProtocol(connector.getProtocol());
    response.setPollIntervalSeconds(connector.getPollIntervalSeconds());
    response.setStatus(connector.getStatus());
    response.setLastPolledAt(connector.getLastPolledAt());
    response.setNotes(connector.getNotes());
    response.setCreatedAt(connector.getCreatedAt());
    response.setUpdatedAt(connector.getUpdatedAt());
    return response;
  }
}
