package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "racks")
public class Rack {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_id", nullable = false)
  private Room room;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Column(name = "height_u", nullable = false)
  private Integer heightU;

  @Column(name = "power_capacity_kw", nullable = false)
  private Double powerCapacityKw;

  @Column(name = "current_power_draw_kw")
  private Double currentPowerDrawKw;

  @Column(name = "max_weight_kg")
  private Double maxWeightKg;

  @Enumerated(EnumType.STRING)
  @Column(name = "containment", nullable = false)
  private RackContainment containment;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private RackStatus status;

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

  public Room getRoom() {
    return room;
  }

  public void setRoom(Room room) {
    this.room = room;
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

  public Integer getHeightU() {
    return heightU;
  }

  public void setHeightU(Integer heightU) {
    this.heightU = heightU;
  }

  public Double getPowerCapacityKw() {
    return powerCapacityKw;
  }

  public void setPowerCapacityKw(Double powerCapacityKw) {
    this.powerCapacityKw = powerCapacityKw;
  }

  public Double getCurrentPowerDrawKw() {
    return currentPowerDrawKw;
  }

  public void setCurrentPowerDrawKw(Double currentPowerDrawKw) {
    this.currentPowerDrawKw = currentPowerDrawKw;
  }

  public Double getMaxWeightKg() {
    return maxWeightKg;
  }

  public void setMaxWeightKg(Double maxWeightKg) {
    this.maxWeightKg = maxWeightKg;
  }

  public RackContainment getContainment() {
    return containment;
  }

  public void setContainment(RackContainment containment) {
    this.containment = containment;
  }

  public RackStatus getStatus() {
    return status;
  }

  public void setStatus(RackStatus status) {
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
