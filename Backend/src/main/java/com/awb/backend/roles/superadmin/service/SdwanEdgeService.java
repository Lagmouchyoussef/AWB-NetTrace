package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.SdwanEdgeRequest;
import com.awb.backend.core.dto.SdwanEdgeResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.SdwanEdge;
import com.awb.backend.core.entity.SdwanEdgeStatus;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.SdwanEdgeRepository;
import com.awb.backend.core.repository.SdwanEdgeSpecifications;
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
public class SdwanEdgeService {

  private final SdwanEdgeRepository sdwanEdgeRepository;
  private final DatacenterRepository datacenterRepository;
  private final AuditLogWriter auditLogWriter;

  public SdwanEdgeService(
      SdwanEdgeRepository sdwanEdgeRepository,
      DatacenterRepository datacenterRepository,
      AuditLogWriter auditLogWriter) {
    this.sdwanEdgeRepository = sdwanEdgeRepository;
    this.datacenterRepository = datacenterRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<SdwanEdgeResponse> list(
      String search, SdwanEdgeStatus status, Long datacenterId, Pageable pageable) {
    Specification<SdwanEdge> spec =
        Specification.where(SdwanEdgeSpecifications.notDeleted())
            .and(SdwanEdgeSpecifications.search(search))
            .and(SdwanEdgeSpecifications.hasStatus(status))
            .and(SdwanEdgeSpecifications.hasDatacenterId(datacenterId));
    return sdwanEdgeRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public SdwanEdgeResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public SdwanEdgeResponse create(SdwanEdgeRequest request, String actorUsername) {
    if (sdwanEdgeRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An SD-WAN edge with this code already exists.");
    }

    SdwanEdge edge = new SdwanEdge();
    edge.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(edge, request);
    Instant now = Instant.now();
    edge.setCreatedAt(now);
    edge.setUpdatedAt(now);
    SdwanEdgeResponse response = toResponse(sdwanEdgeRepository.save(edge));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "SdwanEdge", response.getName(), null);
    return response;
  }

  @Transactional
  public SdwanEdgeResponse update(Long id, SdwanEdgeRequest request, String actorUsername) {
    SdwanEdge edge = findActiveOrThrow(id);
    if (sdwanEdgeRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An SD-WAN edge with this code already exists.");
    }

    edge.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(edge, request);
    edge.setUpdatedAt(Instant.now());
    SdwanEdgeResponse response = toResponse(sdwanEdgeRepository.save(edge));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "SdwanEdge", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    SdwanEdge edge = findActiveOrThrow(id);
    edge.setDeleted(true);
    edge.setUpdatedAt(Instant.now());
    sdwanEdgeRepository.save(edge);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "SdwanEdge", edge.getName(), null);
  }

  private SdwanEdge findActiveOrThrow(Long id) {
    SdwanEdge edge =
        sdwanEdgeRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SD-WAN edge not found."));
    if (edge.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SD-WAN edge not found.");
    }
    return edge;
  }

  private Datacenter findActiveDatacenterOrThrow(Long datacenterId) {
    Datacenter datacenter =
        datacenterRepository
            .findById(datacenterId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found."));
    if (datacenter.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found.");
    }
    return datacenter;
  }

  private void applyRequest(SdwanEdge edge, SdwanEdgeRequest request) {
    edge.setName(request.getName());
    edge.setCode(request.getCode());
    edge.setVendor(request.getVendor());
    edge.setModel(request.getModel());
    edge.setWanLinkCount(request.getWanLinkCount());
    edge.setManagementIp(request.getManagementIp());
    edge.setStatus(request.getStatus());
    edge.setNotes(request.getNotes());
  }

  private SdwanEdgeResponse toResponse(SdwanEdge edge) {
    SdwanEdgeResponse response = new SdwanEdgeResponse();
    response.setId(edge.getId());
    response.setDatacenterId(edge.getDatacenter().getId());
    response.setDatacenterName(edge.getDatacenter().getName());
    response.setName(edge.getName());
    response.setCode(edge.getCode());
    response.setVendor(edge.getVendor());
    response.setModel(edge.getModel());
    response.setWanLinkCount(edge.getWanLinkCount());
    response.setManagementIp(edge.getManagementIp());
    response.setStatus(edge.getStatus());
    response.setNotes(edge.getNotes());
    response.setCreatedAt(edge.getCreatedAt());
    response.setUpdatedAt(edge.getUpdatedAt());
    return response;
  }
}
