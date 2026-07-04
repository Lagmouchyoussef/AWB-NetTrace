package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.RackRequest;
import com.awb.backend.core.dto.RackResponse;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.entity.RackStatus;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.RackSpecifications;
import com.awb.backend.core.repository.RoomRepository;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RackService {

  private final RackRepository rackRepository;
  private final RoomRepository roomRepository;

  public RackService(RackRepository rackRepository, RoomRepository roomRepository) {
    this.rackRepository = rackRepository;
    this.roomRepository = roomRepository;
  }

  @Transactional(readOnly = true)
  public Page<RackResponse> list(String search, RackStatus status, Long roomId, Pageable pageable) {
    Specification<Rack> spec =
        Specification.where(RackSpecifications.notDeleted())
            .and(RackSpecifications.search(search))
            .and(RackSpecifications.hasStatus(status))
            .and(RackSpecifications.hasRoomId(roomId));
    return rackRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public RackResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public RackResponse create(RackRequest request) {
    if (rackRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A rack with this code already exists.");
    }

    Rack rack = new Rack();
    rack.setRoom(findActiveRoomOrThrow(request.getRoomId()));
    applyRequest(rack, request);
    Instant now = Instant.now();
    rack.setCreatedAt(now);
    rack.setUpdatedAt(now);
    return toResponse(rackRepository.save(rack));
  }

  @Transactional
  public RackResponse update(Long id, RackRequest request) {
    Rack rack = findActiveOrThrow(id);
    if (rackRepository.existsByCodeIgnoreCaseAndIdNot(request.getCode(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A rack with this code already exists.");
    }

    rack.setRoom(findActiveRoomOrThrow(request.getRoomId()));
    applyRequest(rack, request);
    rack.setUpdatedAt(Instant.now());
    return toResponse(rackRepository.save(rack));
  }

  @Transactional
  public void delete(Long id) {
    Rack rack = findActiveOrThrow(id);
    rack.setDeleted(true);
    rack.setUpdatedAt(Instant.now());
    rackRepository.save(rack);
  }

  private Rack findActiveOrThrow(Long id) {
    Rack rack =
        rackRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rack not found."));
    if (rack.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rack not found.");
    }
    return rack;
  }

  private Room findActiveRoomOrThrow(Long roomId) {
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

  private void applyRequest(Rack rack, RackRequest request) {
    rack.setName(request.getName());
    rack.setCode(request.getCode());
    rack.setHeightU(request.getHeightU());
    rack.setPowerCapacityKw(request.getPowerCapacityKw());
    rack.setCurrentPowerDrawKw(request.getCurrentPowerDrawKw());
    rack.setMaxWeightKg(request.getMaxWeightKg());
    rack.setContainment(request.getContainment());
    rack.setStatus(request.getStatus());
    rack.setNotes(request.getNotes());
  }

  private RackResponse toResponse(Rack rack) {
    RackResponse response = new RackResponse();
    response.setId(rack.getId());
    response.setRoomId(rack.getRoom().getId());
    response.setRoomName(rack.getRoom().getName());
    response.setName(rack.getName());
    response.setCode(rack.getCode());
    response.setHeightU(rack.getHeightU());
    response.setPowerCapacityKw(rack.getPowerCapacityKw());
    response.setCurrentPowerDrawKw(rack.getCurrentPowerDrawKw());
    response.setMaxWeightKg(rack.getMaxWeightKg());
    response.setContainment(rack.getContainment());
    response.setStatus(rack.getStatus());
    response.setNotes(rack.getNotes());
    response.setCreatedAt(rack.getCreatedAt());
    response.setUpdatedAt(rack.getUpdatedAt());
    return response;
  }
}
