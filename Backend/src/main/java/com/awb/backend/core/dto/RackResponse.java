package com.awb.backend.core.dto;

import com.awb.backend.core.entity.RackContainment;
import com.awb.backend.core.entity.RackStatus;
import java.time.Instant;

public class RackResponse {

  private Long id;
  private Long roomId;
  private String roomName;
  private String name;
  private String code;
  private Integer heightU;
  private Double powerCapacityKw;
  private Double currentPowerDrawKw;
  private Double maxWeightKg;
  private RackContainment containment;
  private RackStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  public String getRoomName() {
    return roomName;
  }

  public void setRoomName(String roomName) {
    this.roomName = roomName;
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
