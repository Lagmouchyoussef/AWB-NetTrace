package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CoolingType;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.entity.RoomType;
import java.time.Instant;

public class RoomResponse {

  private Long id;
  private Long datacenterId;
  private String datacenterName;
  private String name;
  private String code;
  private RoomType roomType;
  private String floor;
  private Double areaSqm;
  private Double maxPowerKw;
  private CoolingType coolingType;
  private RoomStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDatacenterId() {
    return datacenterId;
  }

  public void setDatacenterId(Long datacenterId) {
    this.datacenterId = datacenterId;
  }

  public String getDatacenterName() {
    return datacenterName;
  }

  public void setDatacenterName(String datacenterName) {
    this.datacenterName = datacenterName;
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
