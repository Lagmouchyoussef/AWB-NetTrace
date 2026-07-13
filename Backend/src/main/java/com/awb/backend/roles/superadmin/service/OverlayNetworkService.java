package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.OverlayNetworkResponse;
import com.awb.backend.core.entity.OverlayNetwork;
import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.core.repository.OverlayNetworkRepository;
import com.awb.backend.core.repository.OverlayNetworkSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Read-only: overlay networks (VXLAN/EVPN) are no longer created/edited/deleted through this
// platform - only viewed. Mutating endpoints were removed from every role controller.
@Service
public class OverlayNetworkService {

  private final OverlayNetworkRepository overlayNetworkRepository;

  public OverlayNetworkService(OverlayNetworkRepository overlayNetworkRepository) {
    this.overlayNetworkRepository = overlayNetworkRepository;
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
