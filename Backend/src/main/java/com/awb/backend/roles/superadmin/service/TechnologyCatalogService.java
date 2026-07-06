package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.TechnologyCatalogRequest;
import com.awb.backend.core.dto.TechnologyCatalogResponse;
import com.awb.backend.core.entity.TechnologyCatalogEntry;
import com.awb.backend.core.entity.TechnologyCatalogStatus;
import com.awb.backend.core.entity.TechnologyCategory;
import com.awb.backend.core.repository.TechnologyCatalogRepository;
import com.awb.backend.core.repository.TechnologyCatalogSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TechnologyCatalogService {

  private final TechnologyCatalogRepository technologyCatalogRepository;

  public TechnologyCatalogService(TechnologyCatalogRepository technologyCatalogRepository) {
    this.technologyCatalogRepository = technologyCatalogRepository;
  }

  @Transactional(readOnly = true)
  public Page<TechnologyCatalogResponse> list(
      String search,
      TechnologyCatalogStatus status,
      TechnologyCategory category,
      Pageable pageable) {
    Specification<TechnologyCatalogEntry> spec =
        Specification.where(TechnologyCatalogSpecifications.notDeleted())
            .and(TechnologyCatalogSpecifications.search(search))
            .and(TechnologyCatalogSpecifications.hasStatus(status))
            .and(TechnologyCatalogSpecifications.hasCategory(category));
    return technologyCatalogRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public TechnologyCatalogResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public TechnologyCatalogResponse create(TechnologyCatalogRequest request) {
    if (technologyCatalogRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A technology catalog entry with this code already exists.");
    }

    TechnologyCatalogEntry entry = new TechnologyCatalogEntry();
    applyRequest(entry, request);
    Instant now = Instant.now();
    entry.setCreatedAt(now);
    entry.setUpdatedAt(now);
    return toResponse(technologyCatalogRepository.save(entry));
  }

  @Transactional
  public TechnologyCatalogResponse update(Long id, TechnologyCatalogRequest request) {
    TechnologyCatalogEntry entry = findActiveOrThrow(id);
    if (technologyCatalogRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A technology catalog entry with this code already exists.");
    }

    applyRequest(entry, request);
    entry.setUpdatedAt(Instant.now());
    return toResponse(technologyCatalogRepository.save(entry));
  }

  @Transactional
  public void delete(Long id) {
    TechnologyCatalogEntry entry = findActiveOrThrow(id);
    entry.setDeleted(true);
    entry.setUpdatedAt(Instant.now());
    technologyCatalogRepository.save(entry);
  }

  private TechnologyCatalogEntry findActiveOrThrow(Long id) {
    TechnologyCatalogEntry entry =
        technologyCatalogRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Technology catalog entry not found."));
    if (entry.isDeleted()) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Technology catalog entry not found.");
    }
    return entry;
  }

  private void applyRequest(TechnologyCatalogEntry entry, TechnologyCatalogRequest request) {
    entry.setName(request.getName());
    entry.setCode(request.getCode());
    entry.setCategory(request.getCategory());
    entry.setVendor(request.getVendor());
    entry.setVersion(request.getVersion());
    entry.setDescription(request.getDescription());
    entry.setStatus(request.getStatus());
    entry.setNotes(request.getNotes());
  }

  private TechnologyCatalogResponse toResponse(TechnologyCatalogEntry entry) {
    TechnologyCatalogResponse response = new TechnologyCatalogResponse();
    response.setId(entry.getId());
    response.setName(entry.getName());
    response.setCode(entry.getCode());
    response.setCategory(entry.getCategory());
    response.setVendor(entry.getVendor());
    response.setVersion(entry.getVersion());
    response.setDescription(entry.getDescription());
    response.setStatus(entry.getStatus());
    response.setNotes(entry.getNotes());
    response.setCreatedAt(entry.getCreatedAt());
    response.setUpdatedAt(entry.getUpdatedAt());
    return response;
  }
}
