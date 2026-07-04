package com.awb.backend.core.dto;

import com.awb.backend.core.entity.RackContainment;
import com.awb.backend.core.entity.RackStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RackRequest {

  @NotNull private Long roomId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private Integer heightU;

  @NotNull private Double powerCapacityKw;

  private Double currentPowerDrawKw;

  private Double maxWeightKg;

  @NotNull private RackContainment containment;

  @NotNull private RackStatus status;

  private String notes;

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
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
}
