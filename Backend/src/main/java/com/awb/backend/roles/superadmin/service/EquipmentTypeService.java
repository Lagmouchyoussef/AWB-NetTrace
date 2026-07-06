package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.EquipmentTypeRequest;
import com.awb.backend.core.dto.EquipmentTypeResponse;
import com.awb.backend.core.entity.EquipmentCategory;
import com.awb.backend.core.entity.EquipmentType;
import com.awb.backend.core.entity.EquipmentTypeStatus;
import com.awb.backend.core.repository.EquipmentTypeRepository;
import com.awb.backend.core.repository.EquipmentTypeSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EquipmentTypeService {

  private final EquipmentTypeRepository equipmentTypeRepository;

  public EquipmentTypeService(EquipmentTypeRepository equipmentTypeRepository) {
    this.equipmentTypeRepository = equipmentTypeRepository;
  }

  @Transactional(readOnly = true)
  public Page<EquipmentTypeResponse> list(
      String search, EquipmentTypeStatus status, EquipmentCategory category, Pageable pageable) {
    Specification<EquipmentType> spec =
        Specification.where(EquipmentTypeSpecifications.notDeleted())
            .and(EquipmentTypeSpecifications.search(search))
            .and(EquipmentTypeSpecifications.hasStatus(status))
            .and(EquipmentTypeSpecifications.hasCategory(category));
    return equipmentTypeRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public EquipmentTypeResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public EquipmentTypeResponse create(EquipmentTypeRequest request) {
    if (equipmentTypeRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An equipment type with this code already exists.");
    }

    EquipmentType equipmentType = new EquipmentType();
    applyRequest(equipmentType, request);
    Instant now = Instant.now();
    equipmentType.setCreatedAt(now);
    equipmentType.setUpdatedAt(now);
    return toResponse(equipmentTypeRepository.save(equipmentType));
  }

  @Transactional
  public EquipmentTypeResponse update(Long id, EquipmentTypeRequest request) {
    EquipmentType equipmentType = findActiveOrThrow(id);
    if (equipmentTypeRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "An equipment type with this code already exists.");
    }

    applyRequest(equipmentType, request);
    equipmentType.setUpdatedAt(Instant.now());
    return toResponse(equipmentTypeRepository.save(equipmentType));
  }

  @Transactional
  public void delete(Long id) {
    EquipmentType equipmentType = findActiveOrThrow(id);
    equipmentType.setDeleted(true);
    equipmentType.setUpdatedAt(Instant.now());
    equipmentTypeRepository.save(equipmentType);
  }

  private EquipmentType findActiveOrThrow(Long id) {
    EquipmentType equipmentType =
        equipmentTypeRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment type not found."));
    if (equipmentType.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment type not found.");
    }
    return equipmentType;
  }

  private void applyRequest(EquipmentType equipmentType, EquipmentTypeRequest request) {
    equipmentType.setName(request.getName());
    equipmentType.setCode(request.getCode());
    equipmentType.setCategory(request.getCategory());
    equipmentType.setManufacturer(request.getManufacturer());
    equipmentType.setDefaultRackUnits(request.getDefaultRackUnits());
    equipmentType.setDefaultPowerWatts(request.getDefaultPowerWatts());
    equipmentType.setStatus(request.getStatus());
    equipmentType.setNotes(request.getNotes());
  }

  private EquipmentTypeResponse toResponse(EquipmentType equipmentType) {
    EquipmentTypeResponse response = new EquipmentTypeResponse();
    response.setId(equipmentType.getId());
    response.setName(equipmentType.getName());
    response.setCode(equipmentType.getCode());
    response.setCategory(equipmentType.getCategory());
    response.setManufacturer(equipmentType.getManufacturer());
    response.setDefaultRackUnits(equipmentType.getDefaultRackUnits());
    response.setDefaultPowerWatts(equipmentType.getDefaultPowerWatts());
    response.setStatus(equipmentType.getStatus());
    response.setNotes(equipmentType.getNotes());
    response.setCreatedAt(equipmentType.getCreatedAt());
    response.setUpdatedAt(equipmentType.getUpdatedAt());
    return response;
  }
}
