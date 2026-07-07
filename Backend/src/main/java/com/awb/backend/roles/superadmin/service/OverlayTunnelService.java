package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.OverlayTunnelRequest;
import com.awb.backend.core.dto.OverlayTunnelResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.OverlayTunnel;
import com.awb.backend.core.entity.OverlayTunnelStatus;
import com.awb.backend.core.entity.SdwanEdge;
import com.awb.backend.core.repository.OverlayTunnelRepository;
import com.awb.backend.core.repository.OverlayTunnelSpecifications;
import com.awb.backend.core.repository.SdwanEdgeRepository;
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
public class OverlayTunnelService {

  private final OverlayTunnelRepository overlayTunnelRepository;
  private final SdwanEdgeRepository sdwanEdgeRepository;
  private final AuditLogWriter auditLogWriter;

  public OverlayTunnelService(
      OverlayTunnelRepository overlayTunnelRepository,
      SdwanEdgeRepository sdwanEdgeRepository,
      AuditLogWriter auditLogWriter) {
    this.overlayTunnelRepository = overlayTunnelRepository;
    this.sdwanEdgeRepository = sdwanEdgeRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<OverlayTunnelResponse> list(
      String search, OverlayTunnelStatus status, Pageable pageable) {
    Specification<OverlayTunnel> spec =
        Specification.where(OverlayTunnelSpecifications.notDeleted())
            .and(OverlayTunnelSpecifications.search(search))
            .and(OverlayTunnelSpecifications.hasStatus(status));
    return overlayTunnelRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public OverlayTunnelResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public OverlayTunnelResponse create(OverlayTunnelRequest request, String actorUsername) {
    if (overlayTunnelRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay tunnel with this code already exists.");
    }
    validateEndpoints(request.getSourceEdgeId(), request.getTargetEdgeId());

    OverlayTunnel tunnel = new OverlayTunnel();
    tunnel.setSourceEdge(findActiveEdgeOrThrow(request.getSourceEdgeId()));
    tunnel.setTargetEdge(findActiveEdgeOrThrow(request.getTargetEdgeId()));
    applyRequest(tunnel, request);
    Instant now = Instant.now();
    tunnel.setCreatedAt(now);
    tunnel.setUpdatedAt(now);
    OverlayTunnelResponse response = toResponse(overlayTunnelRepository.save(tunnel));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "OverlayTunnel", response.getName(), null);
    return response;
  }

  @Transactional
  public OverlayTunnelResponse update(Long id, OverlayTunnelRequest request, String actorUsername) {
    OverlayTunnel tunnel = findActiveOrThrow(id);
    if (overlayTunnelRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay tunnel with this code already exists.");
    }
    validateEndpoints(request.getSourceEdgeId(), request.getTargetEdgeId());

    tunnel.setSourceEdge(findActiveEdgeOrThrow(request.getSourceEdgeId()));
    tunnel.setTargetEdge(findActiveEdgeOrThrow(request.getTargetEdgeId()));
    applyRequest(tunnel, request);
    tunnel.setUpdatedAt(Instant.now());
    OverlayTunnelResponse response = toResponse(overlayTunnelRepository.save(tunnel));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "OverlayTunnel", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    OverlayTunnel tunnel = findActiveOrThrow(id);
    tunnel.setDeleted(true);
    tunnel.setUpdatedAt(Instant.now());
    overlayTunnelRepository.save(tunnel);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "OverlayTunnel", tunnel.getName(), null);
  }

  private void validateEndpoints(Long sourceEdgeId, Long targetEdgeId) {
    if (sourceEdgeId.equals(targetEdgeId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay tunnel cannot connect an edge to itself.");
    }
  }

  private OverlayTunnel findActiveOrThrow(Long id) {
    OverlayTunnel tunnel =
        overlayTunnelRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Overlay tunnel not found."));
    if (tunnel.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Overlay tunnel not found.");
    }
    return tunnel;
  }

  private SdwanEdge findActiveEdgeOrThrow(Long edgeId) {
    SdwanEdge edge =
        sdwanEdgeRepository
            .findById(edgeId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.BAD_REQUEST, "SD-WAN edge not found."));
    if (edge.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SD-WAN edge not found.");
    }
    return edge;
  }

  private void applyRequest(OverlayTunnel tunnel, OverlayTunnelRequest request) {
    tunnel.setName(request.getName());
    tunnel.setCode(request.getCode());
    tunnel.setTunnelType(request.getTunnelType());
    tunnel.setBandwidthMbps(request.getBandwidthMbps());
    tunnel.setStatus(request.getStatus());
    tunnel.setNotes(request.getNotes());
  }

  private OverlayTunnelResponse toResponse(OverlayTunnel tunnel) {
    OverlayTunnelResponse response = new OverlayTunnelResponse();
    response.setId(tunnel.getId());
    response.setName(tunnel.getName());
    response.setCode(tunnel.getCode());
    response.setSourceEdgeId(tunnel.getSourceEdge().getId());
    response.setSourceEdgeName(tunnel.getSourceEdge().getName());
    response.setTargetEdgeId(tunnel.getTargetEdge().getId());
    response.setTargetEdgeName(tunnel.getTargetEdge().getName());
    response.setTunnelType(tunnel.getTunnelType());
    response.setBandwidthMbps(tunnel.getBandwidthMbps());
    response.setStatus(tunnel.getStatus());
    response.setNotes(tunnel.getNotes());
    response.setCreatedAt(tunnel.getCreatedAt());
    response.setUpdatedAt(tunnel.getUpdatedAt());
    return response;
  }
}
