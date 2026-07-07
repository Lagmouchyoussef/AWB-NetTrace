package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.InterventionRequest;
import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.ApprovalStatus;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.InterventionSpecifications;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.core.util.AuditLogWriter;
import java.time.Instant;
import java.util.Set;
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
  private final UserRepository userRepository;
  private final AuditLogWriter auditLogWriter;

  public InterventionService(
      InterventionRepository interventionRepository,
      DeviceRepository deviceRepository,
      UserRepository userRepository,
      AuditLogWriter auditLogWriter) {
    this.interventionRepository = interventionRepository;
    this.deviceRepository = deviceRepository;
    this.userRepository = userRepository;
    this.auditLogWriter = auditLogWriter;
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

  // Scoped variant used by DC Admin - identical filters plus a datacenter-membership predicate
  // derived from the caller's assigned datacenters (device -> rack -> room -> datacenter).
  @Transactional(readOnly = true)
  public Page<InterventionResponse> listScoped(
      String search,
      InterventionStatus status,
      InterventionPriority priority,
      Set<Long> datacenterIds,
      Pageable pageable) {
    Specification<Intervention> spec =
        Specification.where(InterventionSpecifications.notDeleted())
            .and(InterventionSpecifications.search(search))
            .and(InterventionSpecifications.hasStatus(status))
            .and(InterventionSpecifications.hasPriority(priority))
            .and(InterventionSpecifications.hasDatacenterIdIn(datacenterIds));
    return interventionRepository.findAll(spec, pageable).map(this::toResponse);
  }

  // The pending-approval queue: PENDING requests within the caller's assigned datacenters.
  @Transactional(readOnly = true)
  public Page<InterventionResponse> getApprovalQueue(Set<Long> datacenterIds, Pageable pageable) {
    Specification<Intervention> spec =
        Specification.where(InterventionSpecifications.notDeleted())
            .and(InterventionSpecifications.hasApprovalStatus(ApprovalStatus.PENDING))
            .and(InterventionSpecifications.hasDatacenterIdIn(datacenterIds));
    return interventionRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public InterventionResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public InterventionResponse create(InterventionRequest request, String actorUsername) {
    Intervention intervention = new Intervention();
    intervention.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(intervention, request);
    Instant now = Instant.now();
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    InterventionResponse response = toResponse(interventionRepository.save(intervention));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Intervention", response.getTitle(), null);
    return response;
  }

  // Used by the DC Admin creation flow: the intervention starts life as a request awaiting
  // approval from another DC Admin (or Super Admin), rather than being auto-approved.
  @Transactional
  public InterventionResponse createPendingApproval(
      InterventionRequest request, String actorUsername) {
    User requester = resolveUser(actorUsername);
    Intervention intervention = new Intervention();
    intervention.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(intervention, request);
    intervention.setRequestedBy(requester);
    intervention.setApprovalStatus(ApprovalStatus.PENDING);
    Instant now = Instant.now();
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    InterventionResponse response = toResponse(interventionRepository.save(intervention));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Intervention", response.getTitle(), null);
    return response;
  }

  // Segregation of duties is enforced here (not just hidden in the UI): a requester can never
  // decide on their own request, whether approving or rejecting. Scope is enforced too - passing
  // null skips the datacenter check (Super Admin has no assignment boundary), a non-null set
  // requires the intervention's device to belong to one of those datacenters.
  @Transactional
  public InterventionResponse approve(Long id, String actorUsername, Set<Long> allowedDatacenterIds) {
    Intervention intervention = findPendingOrThrow(id);
    User approver = resolveUser(actorUsername);
    requireNotOwnRequest(intervention, approver);
    requireInScope(intervention, allowedDatacenterIds);
    intervention.setApprovalStatus(ApprovalStatus.APPROVED);
    intervention.setApprovedBy(approver);
    intervention.setDecidedAt(Instant.now());
    intervention.setUpdatedAt(Instant.now());
    InterventionResponse response = toResponse(interventionRepository.save(intervention));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "Intervention", response.getTitle(), "Approved");
    return response;
  }

  @Transactional
  public InterventionResponse reject(
      Long id, String actorUsername, String comment, Set<Long> allowedDatacenterIds) {
    Intervention intervention = findPendingOrThrow(id);
    User approver = resolveUser(actorUsername);
    requireNotOwnRequest(intervention, approver);
    requireInScope(intervention, allowedDatacenterIds);
    intervention.setApprovalStatus(ApprovalStatus.REJECTED);
    intervention.setApprovedBy(approver);
    intervention.setApprovalComment(comment);
    intervention.setDecidedAt(Instant.now());
    intervention.setUpdatedAt(Instant.now());
    InterventionResponse response = toResponse(interventionRepository.save(intervention));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "Intervention", response.getTitle(), "Rejected");
    return response;
  }

  @Transactional
  public InterventionResponse update(Long id, InterventionRequest request, String actorUsername) {
    Intervention intervention = findActiveOrThrow(id);
    intervention.setDevice(findActiveDeviceOrThrow(request.getDeviceId()));
    applyRequest(intervention, request);
    intervention.setUpdatedAt(Instant.now());
    InterventionResponse response = toResponse(interventionRepository.save(intervention));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "Intervention", response.getTitle(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    Intervention intervention = findActiveOrThrow(id);
    intervention.setDeleted(true);
    intervention.setUpdatedAt(Instant.now());
    interventionRepository.save(intervention);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "Intervention", intervention.getTitle(), null);
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

  private Intervention findPendingOrThrow(Long id) {
    Intervention intervention = findActiveOrThrow(id);
    if (intervention.getApprovalStatus() != ApprovalStatus.PENDING) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Intervention is not awaiting approval.");
    }
    return intervention;
  }

  private void requireNotOwnRequest(Intervention intervention, User approver) {
    User requester = intervention.getRequestedBy();
    if (requester != null && requester.getId().equals(approver.getId())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "You cannot approve or reject your own request.");
    }
  }

  // null means unscoped (Super Admin); a non-null set must contain the intervention's
  // datacenter, mirroring the same device -> rack -> room -> datacenter chain used to build the
  // approval queue itself, so an action is never possible on an item the caller couldn't see.
  private void requireInScope(Intervention intervention, Set<Long> allowedDatacenterIds) {
    if (allowedDatacenterIds == null) {
      return;
    }
    Long datacenterId = intervention.getDevice().getRack().getRoom().getDatacenter().getId();
    if (!allowedDatacenterIds.contains(datacenterId)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "This intervention is outside your assigned datacenters.");
    }
  }

  private User resolveUser(String username) {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));
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
    if (intervention.getRequestedBy() != null) {
      response.setRequestedById(intervention.getRequestedBy().getId());
      response.setRequestedByUsername(intervention.getRequestedBy().getUsername());
    }
    if (intervention.getApprovedBy() != null) {
      response.setApprovedById(intervention.getApprovedBy().getId());
      response.setApprovedByUsername(intervention.getApprovedBy().getUsername());
    }
    response.setApprovalStatus(intervention.getApprovalStatus());
    response.setApprovalComment(intervention.getApprovalComment());
    response.setDecidedAt(intervention.getDecidedAt());
    response.setCreatedAt(intervention.getCreatedAt());
    response.setUpdatedAt(intervention.getUpdatedAt());
    return response;
  }
}
