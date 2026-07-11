package com.awb.backend.roles.technician.dto;

import java.util.List;

public class RackElevationResponse {

  private String rackName;
  private Integer rackHeightU;
  private List<RackElevationDeviceResponse> devices;

  public String getRackName() {
    return rackName;
  }

  public void setRackName(String rackName) {
    this.rackName = rackName;
  }

  public Integer getRackHeightU() {
    return rackHeightU;
  }

  public void setRackHeightU(Integer rackHeightU) {
    this.rackHeightU = rackHeightU;
  }

  public List<RackElevationDeviceResponse> getDevices() {
    return devices;
  }

  public void setDevices(List<RackElevationDeviceResponse> devices) {
    this.devices = devices;
  }
}
