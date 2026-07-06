package com.awb.backend.core.dto;

import jakarta.validation.constraints.NotBlank;

public class AllowedIpRequest {

  @NotBlank private String ipAddress;

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }
}
