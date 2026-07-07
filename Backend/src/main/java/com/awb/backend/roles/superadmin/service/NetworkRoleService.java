package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.NetworkRoleRequest;
import com.awb.backend.core.dto.NetworkRoleResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.NetworkRole;
import com.awb.backend.core.entity.NetworkRoleStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.NetworkRoleRepository;
import com.awb.backend.core.repository.NetworkRoleSpecifications;
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
public class NetworkRoleService {

  private final NetworkRoleRepository networkRoleRepository;
  private final DeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  public NetworkRoleService(
      NetworkRoleRepository networkRoleRepository,
      DeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    this.networkRoleRepository = networkRoleRepository;
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<NetworkRoleResponse> list(
      String search, NetworkRoleStatus status, Pageable pageable) {
    Specification<NetworkRole> spec =
        Specification.where(NetworkRoleSpecifications.notDeleted())
            .and(NetworkRoleSpecifications.search(search))
            .and(NetworkRoleSpecifications.hasStatus(status));
    return networkRoleRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public NetworkRoleResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public NetworkRoleResponse create(NetworkRoleRequest request, String actorUsername) {
    if (networkRoleRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A network role with this code already exists.");
    }
    if (networkRoleRepository.existsByDeviceIdAndDeletedFalse(request.getDeviceId())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "This device already has a network role assigned.");
    }

    NetworkRole role = new NetworkRole();
    role.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(role, request);
    Instant now = Instant.now();
    role.setCreatedAt(now);
    role.setUpdatedAt(now);
    NetworkRoleResponse response = toResponse(networkRoleRepository.save(role));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "NetworkRole", response.getName(), null);
    return response;
  }

  @Transactional
  public NetworkRoleResponse update(Long id, NetworkRoleRequest request, String actorUsername) {
    NetworkRole role = findActiveOrThrow(id);
    if (networkRoleRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A network role with this code already exists.");
    }
    if (networkRoleRepository.existsByDeviceIdAndDeletedFalseAndIdNot(request.getDeviceId(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "This device already has a network role assigned.");
    }

    role.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(role, request);
    role.setUpdatedAt(Instant.now());
    NetworkRoleResponse response = toResponse(networkRoleRepository.save(role));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "NetworkRole", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    NetworkRole role = findActiveOrThrow(id);
    role.setDeleted(true);
    role.setUpdatedAt(Instant.now());
    networkRoleRepository.save(role);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "NetworkRole", role.getName(), null);
  }

  private NetworkRole findActiveOrThrow(Long id) {
    NetworkRole role =
        networkRoleRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Network role not found."));
    if (role.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Network role not found.");
    }
    return role;
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

  private void applyRequest(NetworkRole role, NetworkRoleRequest request) {
    role.setName(request.getName());
    role.setCode(request.getCode());
    role.setRoleType(request.getRoleType());
    role.setAsn(request.getAsn());
    role.setLoopbackIp(request.getLoopbackIp());
    role.setPodNumber(request.getPodNumber());
    role.setStatus(request.getStatus());
    role.setNotes(request.getNotes());
  }

  private NetworkRoleResponse toResponse(NetworkRole role) {
    NetworkRoleResponse response = new NetworkRoleResponse();
    response.setId(role.getId());
    response.setDeviceId(role.getDevice().getId());
    response.setDeviceName(role.getDevice().getName());
    response.setName(role.getName());
    response.setCode(role.getCode());
    response.setRoleType(role.getRoleType());
    response.setAsn(role.getAsn());
    response.setLoopbackIp(role.getLoopbackIp());
    response.setPodNumber(role.getPodNumber());
    response.setStatus(role.getStatus());
    response.setNotes(role.getNotes());
    response.setCreatedAt(role.getCreatedAt());
    response.setUpdatedAt(role.getUpdatedAt());
    return response;
  }
}
