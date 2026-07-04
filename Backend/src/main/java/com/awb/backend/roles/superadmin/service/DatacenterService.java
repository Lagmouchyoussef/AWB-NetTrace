package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.DatacenterRequest;
import com.awb.backend.core.dto.DatacenterResponse;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.DatacenterTier;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.DatacenterSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DatacenterService {

  private final DatacenterRepository datacenterRepository;

  public DatacenterService(DatacenterRepository datacenterRepository) {
    this.datacenterRepository = datacenterRepository;
  }

  public Page<DatacenterResponse> list(
      String search, DatacenterStatus status, DatacenterTier tier, Pageable pageable) {
    Specification<Datacenter> spec =
        Specification.where(DatacenterSpecifications.notDeleted())
            .and(DatacenterSpecifications.search(search))
            .and(DatacenterSpecifications.hasStatus(status))
            .and(DatacenterSpecifications.hasTier(tier));
    return datacenterRepository.findAll(spec, pageable).map(this::toResponse);
  }

  public DatacenterResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  public DatacenterResponse create(DatacenterRequest request) {
    if (datacenterRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A datacenter with this code already exists.");
    }

    Datacenter datacenter = new Datacenter();
    applyRequest(datacenter, request);
    Instant now = Instant.now();
    datacenter.setCreatedAt(now);
    datacenter.setUpdatedAt(now);
    return toResponse(datacenterRepository.save(datacenter));
  }

  public DatacenterResponse update(Long id, DatacenterRequest request) {
    Datacenter datacenter = findActiveOrThrow(id);
    if (datacenterRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A datacenter with this code already exists.");
    }

    applyRequest(datacenter, request);
    datacenter.setUpdatedAt(Instant.now());
    return toResponse(datacenterRepository.save(datacenter));
  }

  public void delete(Long id) {
    Datacenter datacenter = findActiveOrThrow(id);
    datacenter.setDeleted(true);
    datacenter.setUpdatedAt(Instant.now());
    datacenterRepository.save(datacenter);
  }

  private Datacenter findActiveOrThrow(Long id) {
    Datacenter datacenter =
        datacenterRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Datacenter not found."));
    if (datacenter.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Datacenter not found.");
    }
    return datacenter;
  }

  private void applyRequest(Datacenter datacenter, DatacenterRequest request) {
    datacenter.setName(request.getName());
    datacenter.setCode(request.getCode());
    datacenter.setCity(request.getCity());
    datacenter.setCountry(request.getCountry());
    datacenter.setAddress(request.getAddress());
    datacenter.setTier(request.getTier());
    datacenter.setStatus(request.getStatus());
    datacenter.setTotalPowerKw(request.getTotalPowerKw());
    datacenter.setTotalSpaceSqm(request.getTotalSpaceSqm());
    datacenter.setNotes(request.getNotes());
  }

  private DatacenterResponse toResponse(Datacenter datacenter) {
    DatacenterResponse response = new DatacenterResponse();
    response.setId(datacenter.getId());
    response.setName(datacenter.getName());
    response.setCode(datacenter.getCode());
    response.setCity(datacenter.getCity());
    response.setCountry(datacenter.getCountry());
    response.setAddress(datacenter.getAddress());
    response.setTier(datacenter.getTier());
    response.setStatus(datacenter.getStatus());
    response.setTotalPowerKw(datacenter.getTotalPowerKw());
    response.setTotalSpaceSqm(datacenter.getTotalSpaceSqm());
    response.setNotes(datacenter.getNotes());
    response.setCreatedAt(datacenter.getCreatedAt());
    response.setUpdatedAt(datacenter.getUpdatedAt());
    return response;
  }
}
