package com.awb.backend.core.dto;

import com.awb.backend.core.entity.Role;
import jakarta.validation.constraints.NotNull;

public class RolePermissionRequest {

  @NotNull private Role role;

  @NotNull private Long permissionId;

  private boolean granted = true;

  private String notes;

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public Long getPermissionId() {
    return permissionId;
  }

  public void setPermissionId(Long permissionId) {
    this.permissionId = permissionId;
  }

  public boolean isGranted() {
    return granted;
  }

  public void setGranted(boolean granted) {
    this.granted = granted;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
