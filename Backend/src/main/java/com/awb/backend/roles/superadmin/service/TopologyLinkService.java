package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.TopologyLinkRequest;
import com.awb.backend.core.dto.TopologyLinkResponse;
import com.awb.backend.core.entity.NetworkRole;
import com.awb.backend.core.entity.TopologyLink;
import com.awb.backend.core.entity.TopologyLinkStatus;
import com.awb.backend.core.repository.NetworkRoleRepository;
import com.awb.backend.core.repository.TopologyLinkRepository;
import com.awb.backend.core.repository.TopologyLinkSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TopologyLinkService {

  private final TopologyLinkRepository topologyLinkRepository;
  private final NetworkRoleRepository networkRoleRepository;

  public TopologyLinkService(
      TopologyLinkRepository topologyLinkRepository, NetworkRoleRepository networkRoleRepository) {
    this.topologyLinkRepository = topologyLinkRepository;
    this.networkRoleRepository = networkRoleRepository;
  }

  @Transactional(readOnly = true)
  public Page<TopologyLinkResponse> list(
      String search, TopologyLinkStatus status, Pageable pageable) {
    Specification<TopologyLink> spec =
        Specification.where(TopologyLinkSpecifications.notDeleted())
            .and(TopologyLinkSpecifications.search(search))
            .and(TopologyLinkSpecifications.hasStatus(status));
    return topologyLinkRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public TopologyLinkResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public TopologyLinkResponse create(TopologyLinkRequest request) {
    if (topologyLinkRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A topology link with this code already exists.");
    }
    validateEndpoints(request.getSourceRoleId(), request.getTargetRoleId());

    TopologyLink link = new TopologyLink();
    link.setSourceRole(findActiveRoleOrThrow(request.getSourceRoleId()));
    link.setTargetRole(findActiveRoleOrThrow(request.getTargetRoleId()));
    applyRequest(link, request);
    Instant now = Instant.now();
    link.setCreatedAt(now);
    link.setUpdatedAt(now);
    return toResponse(topologyLinkRepository.save(link));
  }

  @Transactional
  public TopologyLinkResponse update(Long id, TopologyLinkRequest request) {
    TopologyLink link = findActiveOrThrow(id);
    if (topologyLinkRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A topology link with this code already exists.");
    }
    validateEndpoints(request.getSourceRoleId(), request.getTargetRoleId());

    link.setSourceRole(findActiveRoleOrThrow(request.getSourceRoleId()));
    link.setTargetRole(findActiveRoleOrThrow(request.getTargetRoleId()));
    applyRequest(link, request);
    link.setUpdatedAt(Instant.now());
    return toResponse(topologyLinkRepository.save(link));
  }

  @Transactional
  public void delete(Long id) {
    TopologyLink link = findActiveOrThrow(id);
    link.setDeleted(true);
    link.setUpdatedAt(Instant.now());
    topologyLinkRepository.save(link);
  }

  private void validateEndpoints(Long sourceRoleId, Long targetRoleId) {
    if (sourceRoleId.equals(targetRoleId)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A topology link cannot connect a role to itself.");
    }
  }

  private TopologyLink findActiveOrThrow(Long id) {
    TopologyLink link =
        topologyLinkRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Topology link not found."));
    if (link.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Topology link not found.");
    }
    return link;
  }

  private NetworkRole findActiveRoleOrThrow(Long roleId) {
    NetworkRole role =
        networkRoleRepository
            .findById(roleId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.BAD_REQUEST, "Network role not found."));
    if (role.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Network role not found.");
    }
    return role;
  }

  private void applyRequest(TopologyLink link, TopologyLinkRequest request) {
    link.setName(request.getName());
    link.setCode(request.getCode());
    link.setLinkType(request.getLinkType());
    link.setSpeedGbps(request.getSpeedGbps());
    link.setStatus(request.getStatus());
    link.setNotes(request.getNotes());
  }

  private TopologyLinkResponse toResponse(TopologyLink link) {
    TopologyLinkResponse response = new TopologyLinkResponse();
    response.setId(link.getId());
    response.setName(link.getName());
    response.setCode(link.getCode());
    response.setSourceRoleId(link.getSourceRole().getId());
    response.setSourceRoleName(link.getSourceRole().getName());
    response.setTargetRoleId(link.getTargetRole().getId());
    response.setTargetRoleName(link.getTargetRole().getName());
    response.setLinkType(link.getLinkType());
    response.setSpeedGbps(link.getSpeedGbps());
    response.setStatus(link.getStatus());
    response.setNotes(link.getNotes());
    response.setCreatedAt(link.getCreatedAt());
    response.setUpdatedAt(link.getUpdatedAt());
    return response;
  }
}
