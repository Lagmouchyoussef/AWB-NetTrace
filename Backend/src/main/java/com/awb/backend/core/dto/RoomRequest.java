package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CoolingType;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.entity.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RoomRequest {

  @NotNull private Long datacenterId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private RoomType roomType;

  private String floor;

  private Double areaSqm;

  private Double maxPowerKw;

  @NotNull private CoolingType coolingType;

  @NotNull private RoomStatus status;

  private String notes;

  public Long getDatacenterId() {
    return datacenterId;
  }

  public void setDatacenterId(Long datacenterId) {
    this.datacenterId = datacenterId;
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

  public RoomType getRoomType() {
    return roomType;
  }

  public void setRoomType(RoomType roomType) {
    this.roomType = roomType;
  }

  public String getFloor() {
    return floor;
  }

  public void setFloor(String floor) {
    this.floor = floor;
  }

  public Double getAreaSqm() {
    return areaSqm;
  }

  public void setAreaSqm(Double areaSqm) {
    this.areaSqm = areaSqm;
  }

  public Double getMaxPowerKw() {
    return maxPowerKw;
  }

  public void setMaxPowerKw(Double maxPowerKw) {
    this.maxPowerKw = maxPowerKw;
  }

  public CoolingType getCoolingType() {
    return coolingType;
  }

  public void setCoolingType(CoolingType coolingType) {
    this.coolingType = coolingType;
  }

  public RoomStatus getStatus() {
    return status;
  }

  public void setStatus(RoomStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
