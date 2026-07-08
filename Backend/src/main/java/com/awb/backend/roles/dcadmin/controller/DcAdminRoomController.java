package com.awb.backend.roles.dcadmin.controller;

import com.awb.backend.core.dto.RoomRequest;
import com.awb.backend.core.dto.RoomResponse;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.roles.superadmin.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same RoomService Super Admin uses - see DcAdminDatacenterController.
@RestController
@RequestMapping("/api/roles/dc-admin/rooms")
public class DcAdminRoomController {

  private final RoomService roomService;

  public DcAdminRoomController(RoomService roomService) {
    this.roomService = roomService;
  }

  @GetMapping
  public Page<RoomResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) RoomStatus status,
      @RequestParam(required = false) Long datacenterId,
      Pageable pageable) {
    return roomService.list(search, status, datacenterId, pageable);
  }

  @GetMapping("/{id}")
  public RoomResponse getById(@PathVariable Long id) {
    return roomService.getById(id);
  }

  @PostMapping
  public ResponseEntity<RoomResponse> create(
      @Valid @RequestBody RoomRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(roomService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public RoomResponse update(
      @PathVariable Long id,
      @Valid @RequestBody RoomRequest request,
      Authentication authentication) {
    return roomService.update(id, request, authentication.getName());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
    roomService.delete(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
