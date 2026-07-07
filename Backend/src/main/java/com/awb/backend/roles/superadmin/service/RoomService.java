package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.RoomRequest;
import com.awb.backend.core.dto.RoomResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.RoomRepository;
import com.awb.backend.core.repository.RoomSpecifications;
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
public class RoomService {

  private final RoomRepository roomRepository;
  private final DatacenterRepository datacenterRepository;
  private final AuditLogWriter auditLogWriter;

  public RoomService(
      RoomRepository roomRepository,
      DatacenterRepository datacenterRepository,
      AuditLogWriter auditLogWriter) {
    this.roomRepository = roomRepository;
    this.datacenterRepository = datacenterRepository;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public Page<RoomResponse> list(
      String search, RoomStatus status, Long datacenterId, Pageable pageable) {
    Specification<Room> spec =
        Specification.where(RoomSpecifications.notDeleted())
            .and(RoomSpecifications.search(search))
            .and(RoomSpecifications.hasStatus(status))
            .and(RoomSpecifications.hasDatacenterId(datacenterId));
    return roomRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public RoomResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public RoomResponse create(RoomRequest request, String actorUsername) {
    if (roomRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A room with this code already exists.");
    }

    Room room = new Room();
    room.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(room, request);
    Instant now = Instant.now();
    room.setCreatedAt(now);
    room.setUpdatedAt(now);
    RoomResponse response = toResponse(roomRepository.save(room));
    auditLogWriter.log(actorUsername, AuditAction.CREATE, "Room", response.getName(), null);
    return response;
  }

  @Transactional
  public RoomResponse update(Long id, RoomRequest request, String actorUsername) {
    Room room = findActiveOrThrow(id);
    if (roomRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A room with this code already exists.");
    }

    room.setDatacenter(findActiveDatacenterOrThrow(request.getDatacenterId()));
    applyRequest(room, request);
    room.setUpdatedAt(Instant.now());
    RoomResponse response = toResponse(roomRepository.save(room));
    auditLogWriter.log(actorUsername, AuditAction.UPDATE, "Room", response.getName(), null);
    return response;
  }

  @Transactional
  public void delete(Long id, String actorUsername) {
    Room room = findActiveOrThrow(id);
    room.setDeleted(true);
    room.setUpdatedAt(Instant.now());
    roomRepository.save(room);
    auditLogWriter.log(actorUsername, AuditAction.DELETE, "Room", room.getName(), null);
  }

  private Room findActiveOrThrow(Long id) {
    Room room =
        roomRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found."));
    if (room.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found.");
    }
    return room;
  }

  private Datacenter findActiveDatacenterOrThrow(Long datacenterId) {
    Datacenter datacenter =
        datacenterRepository
            .findById(datacenterId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found."));
    if (datacenter.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Datacenter not found.");
    }
    return datacenter;
  }

  private void applyRequest(Room room, RoomRequest request) {
    room.setName(request.getName());
    room.setCode(request.getCode());
    room.setRoomType(request.getRoomType());
    room.setFloor(request.getFloor());
    room.setAreaSqm(request.getAreaSqm());
    room.setMaxPowerKw(request.getMaxPowerKw());
    room.setCoolingType(request.getCoolingType());
    room.setStatus(request.getStatus());
    room.setNotes(request.getNotes());
  }

  private RoomResponse toResponse(Room room) {
    RoomResponse response = new RoomResponse();
    response.setId(room.getId());
    response.setDatacenterId(room.getDatacenter().getId());
    response.setDatacenterName(room.getDatacenter().getName());
    response.setName(room.getName());
    response.setCode(room.getCode());
    response.setRoomType(room.getRoomType());
    response.setFloor(room.getFloor());
    response.setAreaSqm(room.getAreaSqm());
    response.setMaxPowerKw(room.getMaxPowerKw());
    response.setCoolingType(room.getCoolingType());
    response.setStatus(room.getStatus());
    response.setNotes(room.getNotes());
    response.setCreatedAt(room.getCreatedAt());
    response.setUpdatedAt(room.getUpdatedAt());
    return response;
  }
}
