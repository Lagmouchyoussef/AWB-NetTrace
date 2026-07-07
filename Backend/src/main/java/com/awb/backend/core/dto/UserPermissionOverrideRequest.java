package com.awb.backend.core.dto;

import jakarta.validation.constraints.NotNull;

public class UserPermissionOverrideRequest {

  @NotNull private Boolean granted;

  private String notes;

  public Boolean getGranted() {
    return granted;
  }

  public void setGranted(Boolean granted) {
    this.granted = granted;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
