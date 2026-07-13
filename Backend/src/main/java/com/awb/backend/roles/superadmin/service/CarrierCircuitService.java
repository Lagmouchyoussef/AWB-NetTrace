package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.CarrierCircuitRequest;
import com.awb.backend.core.dto.CarrierCircuitResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.CarrierCircuit;
import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.core.entity.Connector;
import com.awb.backend.core.repository.CarrierCircuitRepository;
import com.awb.backend.core.repository.CarrierCircuitSpecifications;
import com.awb.backend.core.repository.ConnectorRepository;
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
public class CarrierCircuitService {

  private final CarrierCircuitRepository carrierCircuitRepository;
  private final ConnectorRepository connectorRepository;
  private final AuditLogWriter auditLogWriter;

  public CarrierCircuitService(
      CarrierCircuitRepository carrierCircuitRepository,
      ConnectorRepository connectorRepository,
      AuditLogWriter auditLogWriter) {
    this.carrierCircuitRepository = carrierCircuitRepository;
    this.connectorRepository = connectorRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<CarrierCircuitResponse> list(
      String search, CarrierCircuitStatus status, Long connectorId, Pageable pageable) {
    Specification<CarrierCircuit> spec =
        Specification.where(CarrierCircuitSpecifications.notDeleted())
            .and(CarrierCircuitSpecifications.search(search))
            .and(CarrierCircuitSpecifications.hasStatus(status))
            .and(CarrierCircuitSpecifications.hasConnectorId(connectorId));
    return carrierCircuitRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public CarrierCircuitResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public CarrierCircuitResponse create(CarrierCircuitRequest request, String actorUsername) {
    if (carrierCircuitRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A carrier circuit with this code already exists.");
    }

    CarrierCircuit circuit = new CarrierCircuit();
    applyRequest(circuit, request);
    Instant now = Instant.now();
    circuit.setCreatedAt(now);
    circuit.setUpdatedAt(now);
    CarrierCircuitResponse response = toResponse(carrierCircuitRepository.save(circuit));
    auditLogWriter.log(
        actorUsername, AuditAction.CREATE, "CarrierCircuit", response.getName(), null);
    return response;
  }

  @Transactional
  public CarrierCircuitResponse update(
      Long id, CarrierCircuitRequest request, String actorUsername) {
    CarrierCircuit circuit = findActiveOrThrow(id);
    if (carrierCircuitRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A carrier circuit with this code already exists.");
    }

    applyRequest(circuit, request);
    circuit.setUpdatedAt(Instant.now());
    CarrierCircuitResponse response = toResponse(carrierCircuitRepository.save(circuit));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "CarrierCircuit", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    CarrierCircuit circuit = findActiveOrThrow(id);
    circuit.setDeleted(true);
    circuit.setUpdatedAt(Instant.now());
    carrierCircuitRepository.save(circuit);
    auditLogWriter.log(
        actorUsername, AuditAction.DELETE, "CarrierCircuit", circuit.getName(), null);
  }

  private CarrierCircuit findActiveOrThrow(Long id) {
    CarrierCircuit circuit =
        carrierCircuitRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Carrier circuit not found."));
    if (circuit.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Carrier circuit not found.");
    }
    return circuit;
  }

  private Connector findActiveConnectorOrThrow(Long connectorId) {
    Connector connector =
        connectorRepository
            .findById(connectorId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Connector not found."));
    if (connector.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Connector not found.");
    }
    return connector;
  }

  private void applyRequest(CarrierCircuit circuit, CarrierCircuitRequest request) {
    circuit.setName(request.getName());
    circuit.setCode(request.getCode());
    circuit.setCircuitType(request.getCircuitType());
    circuit.setProvider(request.getProvider());
    circuit.setTerminatesAtConnector(
        request.getTerminatesAtConnectorId() == null
            ? null
            : findActiveConnectorOrThrow(request.getTerminatesAtConnectorId()));
    circuit.setStatus(request.getStatus());
    circuit.setNotes(request.getNotes());
  }

  private CarrierCircuitResponse toResponse(CarrierCircuit circuit) {
    CarrierCircuitResponse response = new CarrierCircuitResponse();
    response.setId(circuit.getId());
    response.setName(circuit.getName());
    response.setCode(circuit.getCode());
    response.setCircuitType(circuit.getCircuitType());
    response.setProvider(circuit.getProvider());
    if (circuit.getTerminatesAtConnector() != null) {
      response.setTerminatesAtConnectorId(circuit.getTerminatesAtConnector().getId());
      response.setTerminatesAtConnectorName(circuit.getTerminatesAtConnector().getName());
    }
    response.setStatus(circuit.getStatus());
    response.setNotes(circuit.getNotes());
    response.setCreatedAt(circuit.getCreatedAt());
    response.setUpdatedAt(circuit.getUpdatedAt());
    return response;
  }
}
