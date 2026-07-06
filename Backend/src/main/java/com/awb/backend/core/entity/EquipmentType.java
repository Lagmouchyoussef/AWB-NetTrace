package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "equipment_types")
public class EquipmentType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", nullable = false)
  private EquipmentCategory category;

  @Column(name = "manufacturer")
  private String manufacturer;

  @Column(name = "default_rack_units")
  private Integer defaultRackUnits;

  @Column(name = "default_power_watts")
  private Integer defaultPowerWatts;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private EquipmentTypeStatus status;

  @Column(name = "notes")
  private String notes;

  @Column(name = "deleted", nullable = false)
  private boolean deleted;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public Long getId() {
    return id;
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

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
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
