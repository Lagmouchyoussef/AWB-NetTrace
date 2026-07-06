package com.awb.backend.core.dto;

public class IpRestrictionRequest {

  private boolean ipRestrictionEnabled;

  public boolean isIpRestrictionEnabled() {
    return ipRestrictionEnabled;
  }

  public void setIpRestrictionEnabled(boolean ipRestrictionEnabled) {
    this.ipRestrictionEnabled = ipRestrictionEnabled;
  }
}
