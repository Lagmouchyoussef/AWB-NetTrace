package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.IntegrationConnectorRequest;
import com.awb.backend.core.dto.IntegrationConnectorResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.IntegrationConnector;
import com.awb.backend.core.entity.IntegrationConnectorStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.IntegrationConnectorRepository;
import com.awb.backend.core.repository.IntegrationConnectorSpecifications;
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
public class IntegrationConnectorService {

  private final IntegrationConnectorRepository integrationConnectorRepository;
  private final DeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  public IntegrationConnectorService(
      IntegrationConnectorRepository integrationConnectorRepository,
      DeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    this.integrationConnectorRepository = integrationConnectorRepository;
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<IntegrationConnectorResponse> list(
      String search, IntegrationConnectorStatus status, Pageable pageable) {
    Specification<IntegrationConnector> spec =
        Specification.where(IntegrationConnectorSpecifications.notDeleted())
            .and(IntegrationConnectorSpecifications.search(search))
            .and(IntegrationConnectorSpecifications.hasStatus(status));
    return integrationConnectorRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public IntegrationConnectorResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public IntegrationConnectorResponse create(IntegrationConnectorRequest request, String actorUsername) {
    if (integrationConnectorRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An integration connector with this code already exists.");
    }

    IntegrationConnector connector = new IntegrationConnector();
    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    Instant now = Instant.now();
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    IntegrationConnectorResponse response = toResponse(integrationConnectorRepository.save(connector));
    auditLogWriter.log(
        actorUsername, AuditAction.CREATE, "IntegrationConnector", response.getName(), null);
    return response;
  }

  @Transactional
  public IntegrationConnectorResponse update(
      Long id, IntegrationConnectorRequest request, String actorUsername) {
    IntegrationConnector connector = findActiveOrThrow(id);
    if (integrationConnectorRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An integration connector with this code already exists.");
    }

    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    connector.setUpdatedAt(Instant.now());
    IntegrationConnectorResponse response = toResponse(integrationConnectorRepository.save(connector));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "IntegrationConnector", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    IntegrationConnector connector = findActiveOrThrow(id);
    connector.setDeleted(true);
    connector.setUpdatedAt(Instant.now());
    integrationConnectorRepository.save(connector);
    auditLogWriter.log(
        actorUsername, AuditAction.DELETE, "IntegrationConnector", connector.getName(), null);
  }

  private IntegrationConnector findActiveOrThrow(Long id) {
    IntegrationConnector connector =
        integrationConnectorRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Integration connector not found."));
    if (connector.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Integration connector not found.");
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

  private void applyRequest(IntegrationConnector connector, IntegrationConnectorRequest request) {
    connector.setName(request.getName());
    connector.setCode(request.getCode());
    connector.setProtocol(request.getProtocol());
    connector.setAutomationType(request.getAutomationType());
    connector.setStatus(request.getStatus());
    connector.setLastSyncAt(request.getLastSyncAt());
    connector.setNotes(request.getNotes());
  }

  private IntegrationConnectorResponse toResponse(IntegrationConnector connector) {
    IntegrationConnectorResponse response = new IntegrationConnectorResponse();
    response.setId(connector.getId());
    response.setDeviceId(connector.getDevice().getId());
    response.setDeviceName(connector.getDevice().getName());
    response.setName(connector.getName());
    response.setCode(connector.getCode());
    response.setProtocol(connector.getProtocol());
    response.setAutomationType(connector.getAutomationType());
    response.setStatus(connector.getStatus());
    response.setLastSyncAt(connector.getLastSyncAt());
    response.setNotes(connector.getNotes());
    response.setCreatedAt(connector.getCreatedAt());
    response.setUpdatedAt(connector.getUpdatedAt());
    return response;
  }
}
