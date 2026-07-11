package com.awb.backend.roles.technician.dto;

import com.awb.backend.core.entity.DeviceType;

public class RackElevationDeviceResponse {

  private Long id;
  private String name;
  private DeviceType deviceType;
  private Integer positionUStart;
  private Integer heightU;
  private boolean target;

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

  public DeviceType getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(DeviceType deviceType) {
    this.deviceType = deviceType;
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

  public boolean isTarget() {
    return target;
  }

  public void setTarget(boolean target) {
    this.target = target;
  }
}
