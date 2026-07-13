package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.PathwayRequest;
import com.awb.backend.core.dto.PathwayResponse;
import com.awb.backend.core.dto.PathwaySegmentResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.Pathway;
import com.awb.backend.core.entity.PathwaySegment;
import com.awb.backend.core.entity.PathwayStatus;
import com.awb.backend.core.entity.PathwayType;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.repository.CablePathwaySegmentRepository;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.PathwayRepository;
import com.awb.backend.core.repository.PathwaySegmentRepository;
import com.awb.backend.core.repository.PathwaySpecifications;
import com.awb.backend.core.repository.RoomRepository;
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
public class PathwayService {

  private static final int DEFAULT_FILL_THRESHOLD_PERCENT = 80;

  private final PathwayRepository pathwayRepository;
  private final PathwaySegmentRepository pathwaySegmentRepository;
  private final CablePathwaySegmentRepository cablePathwaySegmentRepository;
  private final DatacenterRepository datacenterRepository;
  private final RoomRepository roomRepository;
  private final AuditLogWriter auditLogWriter;

  public PathwayService(
      PathwayRepository pathwayRepository,
      PathwaySegmentRepository pathwaySegmentRepository,
      CablePathwaySegmentRepository cablePathwaySegmentRepository,
      DatacenterRepository datacenterRepository,
      RoomRepository roomRepository,
      AuditLogWriter auditLogWriter) {
    this.pathwayRepository = pathwayRepository;
    this.pathwaySegmentRepository = pathwaySegmentRepository;
    this.cablePathwaySegmentRepository = cablePathwaySegmentRepository;
    this.datacenterRepository = datacenterRepository;
    this.roomRepository = roomRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<PathwayResponse> list(
      String search,
      PathwayStatus status,
      PathwayType type,
      Long datacenterId,
      Pageable pageable) {
    Specification<Pathway> spec =
        Specification.where(PathwaySpecifications.notDeleted())
            .and(PathwaySpecifications.search(search))
            .and(PathwaySpecifications.hasStatus(status))
            .and(PathwaySpecifications.hasType(type))
            .and(PathwaySpecifications.hasDatacenterId(datacenterId));
    // List responses intentionally omit the nested segment list for performance - only
    // getById/detail populates it.
    return pathwayRepository.findAll(spec, pageable).map(pathway -> toResponse(pathway, false));
  }

  @Transactional(readOnly = true)
  public PathwayResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id), true);
  }

  @Transactional
  public PathwayResponse create(PathwayRequest request, String actorUsername) {
    if (pathwayRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A pathway with this code already exists.");
    }

    Pathway pathway = new Pathway();
    pathway.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    pathway.setRoom(resolveActiveRoomOrThrow(request.getRoomId()));
    applyRequest(pathway, request);
    Instant now = Instant.now();
    pathway.setCreatedAt(now);
    pathway.setUpdatedAt(now);
    PathwayResponse response = toResponse(pathwayRepository.save(pathway), false);
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Pathway", response.getName(), null);
    return response;
  }

  @Transactional
  public PathwayResponse update(Long id, PathwayRequest request, String actorUsername) {
    Pathway pathway = findActiveOrThrow(id);
    if (pathwayRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A pathway with this code already exists.");
    }

    pathway.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    pathway.setRoom(resolveActiveRoomOrThrow(request.getRoomId()));
    applyRequest(pathway, request);
    pathway.setUpdatedAt(Instant.now());
    PathwayResponse response = toResponse(pathwayRepository.save(pathway), true);
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "Pathway", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    Pathway pathway = findActiveOrThrow(id);
    pathway.setDeleted(true);
    pathway.setUpdatedAt(Instant.now());
    pathwayRepository.save(pathway);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "Pathway", pathway.getName(), null);
  }

  private Pathway findActiveOrThrow(Long id) {
    Pathway pathway =
        pathwayRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pathway not found."));
    if (pathway.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pathway not found.");
    }
    return pathway;
  }

  private Datacenter findActiveDatacenterOrThrow(Long datacenterId) {
    Datacenter datacenter =
        datacenterRepository
            .findById(datacenterId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found."));
    if (datacenter.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found.");
    }
    return datacenter;
  }

  private Room resolveActiveRoomOrThrow(Long roomId) {
    if (roomId == null) {
      return null;
    }
    Room room =
        roomRepository
            .findById(roomId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found."));
    if (room.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found.");
    }
    return room;
  }

  private void applyRequest(Pathway pathway, PathwayRequest request) {
    pathway.setName(request.getName());
    pathway.setCode(request.getCode());
    pathway.setType(request.getType());
    pathway.setCapacityCableCount(request.getCapacityCableCount());
    pathway.setFillThresholdPercent(
        request.getFillThresholdPercent() != null
            ? request.getFillThresholdPercent()
            : DEFAULT_FILL_THRESHOLD_PERCENT);
    pathway.setStatus(request.getStatus());
    pathway.setNotes(request.getNotes());
  }

  private PathwayResponse toResponse(Pathway pathway, boolean includeSegments) {
    PathwayResponse response = new PathwayResponse();
    response.setId(pathway.getId());
    response.setName(pathway.getName());
    response.setCode(pathway.getCode());
    response.setType(pathway.getType());
    response.setDatacenterId(pathway.getDatacenter().getId());
    response.setDatacenterName(pathway.getDatacenter().getName());
    if (pathway.getRoom() != null) {
      response.setRoomId(pathway.getRoom().getId());
      response.setRoomName(pathway.getRoom().getName());
    }
    response.setCapacityCableCount(pathway.getCapacityCableCount());
    response.setFillThresholdPercent(pathway.getFillThresholdPercent());
    response.setStatus(pathway.getStatus());
    response.setNotes(pathway.getNotes());
    response.setCreatedAt(pathway.getCreatedAt());
    response.setUpdatedAt(pathway.getUpdatedAt());

    long occupiedCount =
        cablePathwaySegmentRepository.countDistinctCableIdByPathwaySegment_Pathway_Id(
            pathway.getId());
    double fillRatePercent =
        pathway.getCapacityCableCount() > 0
            ? occupiedCount * 100.0 / pathway.getCapacityCableCount()
            : 0;
    response.setOccupiedCount(occupiedCount);
    response.setFillRatePercent(fillRatePercent);
    response.setOverThreshold(fillRatePercent >= pathway.getFillThresholdPercent());

    if (includeSegments) {
      response.setSegments(
          pathwaySegmentRepository.findByPathwayIdOrderByOrdinalAsc(pathway.getId()).stream()
              .map(this::toSegmentResponse)
              .toList());
    }
    return response;
  }

  private PathwaySegmentResponse toSegmentResponse(PathwaySegment segment) {
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
