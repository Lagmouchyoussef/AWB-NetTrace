package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.InterventionRequest;
import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.InterventionSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InterventionService {

  private final InterventionRepository interventionRepository;
  private final DeviceRepository deviceRepository;

  public InterventionService(
      InterventionRepository interventionRepository, DeviceRepository deviceRepository) {
    this.interventionRepository = interventionRepository;
    this.deviceRepository = deviceRepository;
  }

  @Transactional(readOnly = true)
  public Page<InterventionResponse> list(
      String search, InterventionStatus status, InterventionPriority priority, Pageable pageable) {
    Specification<Intervention> spec =
        Specification.where(InterventionSpecifications.notDeleted())
            .and(InterventionSpecifications.search(search))
            .and(InterventionSpecifications.hasStatus(status))
            .and(InterventionSpecifications.hasPriority(priority));
    return interventionRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public InterventionResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public InterventionResponse create(InterventionRequest request) {
    Intervention intervention = new Intervention();
    intervention.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(intervention, request);
    Instant now = Instant.now();
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    return toResponse(interventionRepository.save(intervention));
  }

  @Transactional
  public InterventionResponse update(Long id, InterventionRequest request) {
    Intervention intervention = findActiveOrThrow(id);
    intervention.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(intervention, request);
    intervention.setUpdatedAt(Instant.now());
    return toResponse(interventionRepository.save(intervention));
  }

  @Transactional
  public void delete(Long id) {
    Intervention intervention = findActiveOrThrow(id);
    intervention.setDeleted(true);
    intervention.setUpdatedAt(Instant.now());
    interventionRepository.save(intervention);
  }

  private Intervention findActiveOrThrow(Long id) {
    Intervention intervention =
        interventionRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Intervention not found."));
    if (intervention.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Intervention not found.");
    }
    return intervention;
  }

  private Device findActiveDeviceOrThrow(Long deviceId) {
    Device device =
        deviceRepository
            .findById(deviceId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found."));
    if (device.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found.");
    }
    return device;
  }

  private void applyRequest(Intervention intervention, InterventionRequest request) {
    intervention.setTitle(request.getTitle());
    intervention.setDescription(request.getDescription());
    intervention.setInterventionType(request.getInterventionType());
    intervention.setPriority(request.getPriority());
    intervention.setStatus(request.getStatus());
    intervention.setAssignedTechnician(request.getAssignedTechnician());
    intervention.setScheduledAt(request.getScheduledAt());
    intervention.setCompletedAt(request.getCompletedAt());
    intervention.setNotes(request.getNotes());
  }

  private InterventionResponse toResponse(Intervention intervention) {
    InterventionResponse response = new InterventionResponse();
    response.setId(intervention.getId());
    response.setDeviceId(intervention.getDevice().getId());
    response.setDeviceName(intervention.getDevice().getName());
    response.setTitle(intervention.getTitle());
    response.setDescription(intervention.getDescription());
    response.setInterventionType(intervention.getInterventionType());
    response.setPriority(intervention.getPriority());
    response.setStatus(intervention.getStatus());
    response.setAssignedTechnician(intervention.getAssignedTechnician());
    response.setScheduledAt(intervention.getScheduledAt());
    response.setCompletedAt(intervention.getCompletedAt());
    response.setNotes(intervention.getNotes());
    response.setCreatedAt(intervention.getCreatedAt());
    response.setUpdatedAt(intervention.getUpdatedAt());
    return response;
  }
}
