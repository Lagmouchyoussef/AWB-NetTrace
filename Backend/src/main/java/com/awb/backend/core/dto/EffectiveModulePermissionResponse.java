package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PermissionModule;

public class EffectiveModulePermissionResponse {

  private PermissionModule module;
  private boolean defaultAllowed;
  private Boolean roleGranted;
  private Boolean userOverrideGranted;
  private boolean effective;

  public PermissionModule getModule() {
    return module;
  }

  public void setModule(PermissionModule module) {
    this.module = module;
  }

  public boolean isDefaultAllowed() {
    return defaultAllowed;
  }

  public void setDefaultAllowed(boolean defaultAllowed) {
    this.defaultAllowed = defaultAllowed;
  }

  public Boolean getRoleGranted() {
    return roleGranted;
  }

  public void setRoleGranted(Boolean roleGranted) {
    this.roleGranted = roleGranted;
  }

  public Boolean getUserOverrideGranted() {
    return userOverrideGranted;
  }

  public void setUserOverrideGranted(Boolean userOverrideGranted) {
    this.userOverrideGranted = userOverrideGranted;
  }

  public boolean isEffective() {
    return effective;
  }

  public void setEffective(boolean effective) {
    this.effective = effective;
  }
}
