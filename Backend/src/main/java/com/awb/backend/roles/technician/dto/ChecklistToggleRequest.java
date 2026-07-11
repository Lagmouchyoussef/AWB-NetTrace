package com.awb.backend.roles.technician.dto;

public class ChecklistToggleRequest {

  private boolean completed;

  public boolean isCompleted() {
    return completed;
  }

  public void setCompleted(boolean completed) {
    this.completed = completed;
  }
}
