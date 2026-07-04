package com.awb.backend.core.dto;

import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.core.entity.DeviceType;
import java.time.Instant;

public class DeviceResponse {

  private Long id;
  private Long rackId;
  private String rackName;
  private String name;
  private DeviceType deviceType;
  private String manufacturer;
  private String model;
  private String serialNumber;
  private Integer positionUStart;
  private Integer heightU;
  private Double powerConsumptionW;
  private String managementIp;
  private DeviceStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getRackId() {
    return rackId;
  }

  public void setRackId(Long rackId) {
    this.rackId = rackId;
  }

  public String getRackName() {
    return rackName;
  }

  public void setRackName(String rackName) {
    this.rackName = rackName;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public DeviceType getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(DeviceType deviceType) {
    this.deviceType = deviceType;
  }

  public String getManufacturer() {
    return manufacturer;
  }

  public void setManufacturer(String manufacturer) {
    this.manufacturer = manufacturer;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getSerialNumber() {
    return serialNumber;
  }

  public void setSerialNumber(String serialNumber) {
    this.serialNumber = serialNumber;
  }

  public Integer getPositionUStart() {
    return positionUStart;
  }

  public void setPositionUStart(Integer positionUStart) {
    this.positionUStart = positionUStart;
  }

  public Integer getHeightU() {
    return heightU;
  }

  public void setHeightU(Integer heightU) {
    this.heightU = heightU;
  }

  public Double getPowerConsumptionW() {
    return powerConsumptionW;
  }

  public void setPowerConsumptionW(Double powerConsumptionW) {
    this.powerConsumptionW = powerConsumptionW;
  }

  public String getManagementIp() {
    return managementIp;
  }

  public void setManagementIp(String managementIp) {
    this.managementIp = managementIp;
  }

  public DeviceStatus getStatus() {
    return status;
  }

  public void setStatus(DeviceStatus status) {
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
