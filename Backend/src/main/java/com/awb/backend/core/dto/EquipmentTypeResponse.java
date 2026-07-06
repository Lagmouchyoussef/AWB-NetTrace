package com.awb.backend.core.dto;

import com.awb.backend.core.entity.EquipmentCategory;
import com.awb.backend.core.entity.EquipmentTypeStatus;
import java.time.Instant;

public class EquipmentTypeResponse {

  private Long id;
  private String name;
  private String code;
  private EquipmentCategory category;
  private String manufacturer;
  private Integer defaultRackUnits;
  private Integer defaultPowerWatts;
  private EquipmentTypeStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public EquipmentCategory getCategory() {
    return category;
  }

  public void setCategory(EquipmentCategory category) {
    this.category = category;
  }

  public String getManufacturer() {
    return manufacturer;
  }

  public void setManufacturer(String manufacturer) {
    this.manufacturer = manufacturer;
  }

  public Integer getDefaultRackUnits() {
    return defaultRackUnits;
  }

  public void setDefaultRackUnits(Integer defaultRackUnits) {
    this.defaultRackUnits = defaultRackUnits;
  }

  public Integer getDefaultPowerWatts() {
    return defaultPowerWatts;
  }

  public void setDefaultPowerWatts(Integer defaultPowerWatts) {
    this.defaultPowerWatts = defaultPowerWatts;
  }

  public EquipmentTypeStatus getStatus() {
    return status;
  }

  public void setStatus(EquipmentTypeStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
