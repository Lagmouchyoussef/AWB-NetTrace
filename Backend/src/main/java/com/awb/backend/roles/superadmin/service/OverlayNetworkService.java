package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.OverlayNetworkRequest;
import com.awb.backend.core.dto.OverlayNetworkResponse;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.OverlayNetwork;
import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.OverlayNetworkRepository;
import com.awb.backend.core.repository.OverlayNetworkSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OverlayNetworkService {

  private final OverlayNetworkRepository overlayNetworkRepository;
  private final DatacenterRepository datacenterRepository;

  public OverlayNetworkService(
      OverlayNetworkRepository overlayNetworkRepository,
      DatacenterRepository datacenterRepository) {
    this.overlayNetworkRepository = overlayNetworkRepository;
    this.datacenterRepository = datacenterRepository;
  }

  @Transactional(readOnly = true)
  public Page<OverlayNetworkResponse> list(
      String search, OverlayNetworkStatus status, Long datacenterId, Pageable pageable) {
    Specification<OverlayNetwork> spec =
        Specification.where(OverlayNetworkSpecifications.notDeleted())
            .and(OverlayNetworkSpecifications.search(search))
            .and(OverlayNetworkSpecifications.hasStatus(status))
            .and(OverlayNetworkSpecifications.hasDatacenterId(datacenterId));
    return overlayNetworkRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public OverlayNetworkResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public OverlayNetworkResponse create(OverlayNetworkRequest request) {
    if (overlayNetworkRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay network with this code already exists.");
    }
    if (overlayNetworkRepository.existsByVni(request.getVni())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay network with this VNI already exists.");
    }

    OverlayNetwork overlay = new OverlayNetwork();
    overlay.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(overlay, request);
    Instant now = Instant.now();
    overlay.setCreatedAt(now);
    overlay.setUpdatedAt(now);
    return toResponse(overlayNetworkRepository.save(overlay));
  }

  @Transactional
  public OverlayNetworkResponse update(Long id, OverlayNetworkRequest request) {
    OverlayNetwork overlay = findActiveOrThrow(id);
    if (overlayNetworkRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay network with this code already exists.");
    }
    if (overlayNetworkRepository.existsByVniAndIdNot(request.getVni(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An overlay network with this VNI already exists.");
    }

    overlay.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(overlay, request);
    overlay.setUpdatedAt(Instant.now());
    return toResponse(overlayNetworkRepository.save(overlay));
  }

  @Transactional
  public void delete(Long id) {
    OverlayNetwork overlay = findActiveOrThrow(id);
    overlay.setDeleted(true);
    overlay.setUpdatedAt(Instant.now());
    overlayNetworkRepository.save(overlay);
  }

  private OverlayNetwork findActiveOrThrow(Long id) {
    OverlayNetwork overlay =
        overlayNetworkRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Overlay network not found."));
    if (overlay.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Overlay network not found.");
    }
    return overlay;
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

  private void applyRequest(OverlayNetwork overlay, OverlayNetworkRequest request) {
    overlay.setName(request.getName());
    overlay.setCode(request.getCode());
    overlay.setVni(request.getVni());
    overlay.setOverlayType(request.getOverlayType());
    overlay.setVlanId(request.getVlanId());
    overlay.setVrfName(request.getVrfName());
    overlay.setRouteDistinguisher(request.getRouteDistinguisher());
    overlay.setRouteTargets(request.getRouteTargets());
    overlay.setStatus(request.getStatus());
    overlay.setNotes(request.getNotes());
  }

  private OverlayNetworkResponse toResponse(OverlayNetwork overlay) {
    OverlayNetworkResponse response = new OverlayNetworkResponse();
    response.setId(overlay.getId());
    response.setDatacenterId(overlay.getDatacenter().getId());
    response.setDatacenterName(overlay.getDatacenter().getName());
    response.setName(overlay.getName());
    response.setCode(overlay.getCode());
    response.setVni(overlay.getVni());
    response.setOverlayType(overlay.getOverlayType());
    response.setVlanId(overlay.getVlanId());
    response.setVrfName(overlay.getVrfName());
    response.setRouteDistinguisher(overlay.getRouteDistinguisher());
    response.setRouteTargets(overlay.getRouteTargets());
    response.setStatus(overlay.getStatus());
    response.setNotes(overlay.getNotes());
    response.setCreatedAt(overlay.getCreatedAt());
    response.setUpdatedAt(overlay.getUpdatedAt());
    return response;
  }
}
