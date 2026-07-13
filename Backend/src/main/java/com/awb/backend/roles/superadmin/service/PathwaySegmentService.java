package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.PathwaySegmentRequest;
import com.awb.backend.core.dto.PathwaySegmentResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Pathway;
import com.awb.backend.core.entity.PathwaySegment;
import com.awb.backend.core.repository.CablePathwaySegmentRepository;
import com.awb.backend.core.repository.PathwayRepository;
import com.awb.backend.core.repository.PathwaySegmentRepository;
import com.awb.backend.core.repository.PathwaySegmentSpecifications;
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
public class PathwaySegmentService {

  private final PathwaySegmentRepository pathwaySegmentRepository;
  private final PathwayRepository pathwayRepository;
  private final CablePathwaySegmentRepository cablePathwaySegmentRepository;
  private final AuditLogWriter auditLogWriter;

  public PathwaySegmentService(
      PathwaySegmentRepository pathwaySegmentRepository,
      PathwayRepository pathwayRepository,
      CablePathwaySegmentRepository cablePathwaySegmentRepository,
      AuditLogWriter auditLogWriter) {
    this.pathwaySegmentRepository = pathwaySegmentRepository;
    this.pathwayRepository = pathwayRepository;
    this.cablePathwaySegmentRepository = cablePathwaySegmentRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<PathwaySegmentResponse> list(String search, Long pathwayId, Pageable pageable) {
    Specification<PathwaySegment> spec =
        Specification.where(PathwaySegmentSpecifications.notDeleted())
            .and(PathwaySegmentSpecifications.search(search))
            .and(PathwaySegmentSpecifications.hasPathwayId(pathwayId));
    return pathwaySegmentRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public PathwaySegmentResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public PathwaySegmentResponse create(PathwaySegmentRequest request, String actorUsername) {
    PathwaySegment segment = new PathwaySegment();
    segment.setPathway(findActivePathwayOrThrow(request.getPathwayId()));
    applyRequest(segment, request);
    Instant now = Instant.now();
    segment.setCreatedAt(now);
    segment.setUpdatedAt(now);
    PathwaySegmentResponse response = toResponse(pathwaySegmentRepository.save(segment));
    auditLogWriter.log(
        actorUsername, AuditAction.CREATE, "PathwaySegment", response.getName(), null);
    return response;
  }

  @Transactional
  public PathwaySegmentResponse update(
      Long id, PathwaySegmentRequest request, String actorUsername) {
    PathwaySegment segment = findActiveOrThrow(id);
    segment.setPathway(findActivePathwayOrThrow(request.getPathwayId()));
    applyRequest(segment, request);
    segment.setUpdatedAt(Instant.now());
    PathwaySegmentResponse response = toResponse(pathwaySegmentRepository.save(segment));
    auditLogWriter.log(
        actorUsername, AuditAction.UPDATE, "PathwaySegment", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    PathwaySegment segment = findActiveOrThrow(id);
    segment.setDeleted(true);
    segment.setUpdatedAt(Instant.now());
    pathwaySegmentRepository.save(segment);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "PathwaySegment", segment.getName(), null);
  }

  private PathwaySegment findActiveOrThrow(Long id) {
    PathwaySegment segment =
        pathwaySegmentRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pathway segment not found."));
    if (segment.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pathway segment not found.");
    }
    return segment;
  }

  private Pathway findActivePathwayOrThrow(Long pathwayId) {
    Pathway pathway =
        pathwayRepository
            .findById(pathwayId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pathway not found."));
    if (pathway.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pathway not found.");
    }
    return pathway;
  }

  private void applyRequest(PathwaySegment segment, PathwaySegmentRequest request) {
    segment.setName(request.getName());
    segment.setOrdinal(request.getOrdinal());
    segment.setLengthMeters(request.getLengthMeters());
    segment.setCapacityCableCount(request.getCapacityCableCount());
    segment.setNotes(request.getNotes());
  }

  private PathwaySegmentResponse toResponse(PathwaySegment segment) {
    PathwaySegmentResponse response = new PathwaySegmentResponse();
    response.setId(segment.getId());
    response.setPathwayId(segment.getPathway().getId());
    response.setPathwayName(segment.getPathway().getName());
    response.setName(segment.getName());
    response.setOrdinal(segment.getOrdinal());
    response.setLengthMeters(segment.getLengthMeters());
    response.setCapacityCableCount(segment.getCapacityCableCount());
    response.setNotes(segment.getNotes());
    response.setCreatedAt(segment.getCreatedAt());
    response.setUpdatedAt(segment.getUpdatedAt());

    int effectiveCapacity =
        segment.getCapacityCableCount() != null
            ? segment.getCapacityCableCount()
            : segment.getPathway().getCapacityCableCount();
    long occupiedCount =
        cablePathwaySegmentRepository.countDistinctCableIdByPathwaySegmentId(segment.getId());
    double fillRatePercent = effectiveCapacity > 0 ? occupiedCount * 100.0 / effectiveCapacity : 0;
    response.setOccupiedCount(occupiedCount);
    response.setFillRatePercent(fillRatePercent);
    response.setOverThreshold(fillRatePercent >= segment.getPathway().getFillThresholdPercent());
    return response;
  }
}
