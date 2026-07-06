package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.SystemSettingRequest;
import com.awb.backend.core.dto.SystemSettingResponse;
import com.awb.backend.core.entity.SystemSetting;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.repository.SystemSettingRepository;
import com.awb.backend.core.repository.SystemSettingSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SystemSettingService {

  private final SystemSettingRepository systemSettingRepository;

  public SystemSettingService(SystemSettingRepository systemSettingRepository) {
    this.systemSettingRepository = systemSettingRepository;
  }

  @Transactional(readOnly = true)
  public Page<SystemSettingResponse> list(
      String search, SystemSettingCategory category, Pageable pageable) {
    Specification<SystemSetting> spec =
        Specification.where(SystemSettingSpecifications.notDeleted())
            .and(SystemSettingSpecifications.search(search))
            .and(SystemSettingSpecifications.hasCategory(category));
    return systemSettingRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public SystemSettingResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public SystemSettingResponse create(SystemSettingRequest request) {
    if (systemSettingRepository.existsBySettingKeyIgnoreCase(request.getSettingKey())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A setting with this key already exists.");
    }

    SystemSetting setting = new SystemSetting();
    applyRequest(setting, request);
    Instant now = Instant.now();
    setting.setCreatedAt(now);
    setting.setUpdatedAt(now);
    return toResponse(systemSettingRepository.save(setting));
  }

  @Transactional
  public SystemSettingResponse update(Long id, SystemSettingRequest request) {
    SystemSetting setting = findActiveOrThrow(id);
    if (systemSettingRepository.existsBySettingKeyIgnoreCaseAndIdNot(request.getSettingKey(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A setting with this key already exists.");
    }

    applyRequest(setting, request);
    setting.setUpdatedAt(Instant.now());
    return toResponse(systemSettingRepository.save(setting));
  }

  @Transactional
  public void delete(Long id) {
    SystemSetting setting = findActiveOrThrow(id);
    setting.setDeleted(true);
    setting.setUpdatedAt(Instant.now());
    systemSettingRepository.save(setting);
  }

  private SystemSetting findActiveOrThrow(Long id) {
    SystemSetting setting =
        systemSettingRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setting not found."));
    if (setting.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Setting not found.");
    }
    return setting;
  }

  private void applyRequest(SystemSetting setting, SystemSettingRequest request) {
    setting.setSettingKey(request.getSettingKey());
    setting.setSettingValue(request.getSettingValue());
    setting.setCategory(request.getCategory());
    setting.setDataType(request.getDataType());
    setting.setDescription(request.getDescription());
    setting.setNotes(request.getNotes());
  }

  private SystemSettingResponse toResponse(SystemSetting setting) {
    SystemSettingResponse response = new SystemSettingResponse();
    response.setId(setting.getId());
    response.setSettingKey(setting.getSettingKey());
    response.setSettingValue(setting.getSettingValue());
    response.setCategory(setting.getCategory());
    response.setDataType(setting.getDataType());
    response.setDescription(setting.getDescription());
    response.setNotes(setting.getNotes());
    response.setCreatedAt(setting.getCreatedAt());
    response.setUpdatedAt(setting.getUpdatedAt());
    return response;
  }
}
