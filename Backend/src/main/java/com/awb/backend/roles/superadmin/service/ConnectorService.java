package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.ConnectorRequest;
import com.awb.backend.core.dto.ConnectorResponse;
import com.awb.backend.core.entity.Connector;
import com.awb.backend.core.entity.ConnectorStatus;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.ConnectorRepository;
import com.awb.backend.core.repository.ConnectorSpecifications;
import com.awb.backend.core.repository.DeviceRepository;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConnectorService {

  private final ConnectorRepository connectorRepository;
  private final DeviceRepository deviceRepository;

  public ConnectorService(
      ConnectorRepository connectorRepository, DeviceRepository deviceRepository) {
    this.connectorRepository = connectorRepository;
    this.deviceRepository = deviceRepository;
  }

  @Transactional(readOnly = true)
  public Page<ConnectorResponse> list(String search, ConnectorStatus status, Pageable pageable) {
    Specification<Connector> spec =
        Specification.where(ConnectorSpecifications.notDeleted())
            .and(ConnectorSpecifications.search(search))
            .and(ConnectorSpecifications.hasStatus(status));
    return connectorRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public ConnectorResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public ConnectorResponse create(ConnectorRequest request) {
    if (connectorRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A connector with this code already exists.");
    }

    Connector connector = new Connector();
    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    Instant now = Instant.now();
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    return toResponse(connectorRepository.save(connector));
  }

  @Transactional
  public ConnectorResponse update(Long id, ConnectorRequest request) {
    Connector connector = findActiveOrThrow(id);
    if (connectorRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A connector with this code already exists.");
    }

    connector.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(connector, request);
    connector.setUpdatedAt(Instant.now());
    return toResponse(connectorRepository.save(connector));
  }

  @Transactional
  public void delete(Long id) {
    Connector connector = findActiveOrThrow(id);
    connector.setDeleted(true);
    connector.setUpdatedAt(Instant.now());
    connectorRepository.save(connector);
  }

  private Connector findActiveOrThrow(Long id) {
    Connector connector =
        connectorRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Connector not found."));
    if (connector.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Connector not found.");
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

  private void applyRequest(Connector connector, ConnectorRequest request) {
    connector.setName(request.getName());
    connector.setCode(request.getCode());
    connector.setFormFactor(request.getFormFactor());
    connector.setConnectorType(request.getConnectorType());
    connector.setSpeedGbps(request.getSpeedGbps());
    connector.setWavelengthNm(request.getWavelengthNm());
    connector.setStatus(request.getStatus());
    connector.setNotes(request.getNotes());
  }

  private ConnectorResponse toResponse(Connector connector) {
    ConnectorResponse response = new ConnectorResponse();
    response.setId(connector.getId());
    response.setDeviceId(connector.getDevice().getId());
    response.setDeviceName(connector.getDevice().getName());
    response.setName(connector.getName());
    response.setCode(connector.getCode());
    response.setFormFactor(connector.getFormFactor());
    response.setConnectorType(connector.getConnectorType());
    response.setSpeedGbps(connector.getSpeedGbps());
    response.setWavelengthNm(connector.getWavelengthNm());
    response.setStatus(connector.getStatus());
    response.setNotes(connector.getNotes());
    response.setCreatedAt(connector.getCreatedAt());
    response.setUpdatedAt(connector.getUpdatedAt());
    return response;
  }
}
