package com.awb.backend.roles.networkengineer.controller;

import com.awb.backend.core.dto.EquipmentTypeRequest;
import com.awb.backend.core.dto.EquipmentTypeResponse;
import com.awb.backend.core.entity.EquipmentCategory;
import com.awb.backend.core.entity.EquipmentTypeStatus;
import com.awb.backend.roles.superadmin.service.EquipmentTypeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same EquipmentTypeService Super Admin uses. No delete endpoint - decommission
// via status (DEPRECATED).
@RestController
@RequestMapping("/api/roles/network-engineer/equipment-types")
public class NetworkEngineerEquipmentTypeController {

  private final EquipmentTypeService equipmentTypeService;

  public NetworkEngineerEquipmentTypeController(EquipmentTypeService equipmentTypeService) {
    this.equipmentTypeService = equipmentTypeService;
  }

  @GetMapping
  public Page<EquipmentTypeResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) EquipmentTypeStatus status,
      @RequestParam(required = false) EquipmentCategory category,
      Pageable pageable) {
    return equipmentTypeService.list(search, status, category, pageable);
  }

  @GetMapping("/{id}")
  public EquipmentTypeResponse getById(@PathVariable Long id) {
    return equipmentTypeService.getById(id);
  }

  @PostMapping
  public ResponseEntity<EquipmentTypeResponse> create(
      @Valid @RequestBody EquipmentTypeRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(equipmentTypeService.create(request, authentication.getName()));
  }

  @PutMapping("/{id}")
  public EquipmentTypeResponse update(
      @PathVariable Long id,
      @Valid @RequestBody EquipmentTypeRequest request,
      Authentication authentication) {
    return equipmentTypeService.update(id, request, authentication.getName());
  }
}
