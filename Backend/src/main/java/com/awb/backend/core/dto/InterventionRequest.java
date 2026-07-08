package com.awb.backend.core.dto;

import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class InterventionRequest {

  @NotNull private Long deviceId;

  @NotBlank private String title;

  private String description;

  @NotNull private InterventionType interventionType;

  @NotNull private InterventionPriority priority;

  @NotNull private InterventionStatus status;

  private Long assignedTechnicianId;

  @NotNull private Instant scheduledAt;

  private Instant completedAt;

  private String notes;

  public Long getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(Long deviceId) {
    this.deviceId = deviceId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public InterventionType getInterventionType() {
    return interventionType;
  }

  public void setInterventionType(InterventionType interventionType) {
    this.interventionType = interventionType;
  }

  public InterventionPriority getPriority() {
    return priority;
  }

  public void setPriority(InterventionPriority priority) {
    this.priority = priority;
  }

  public InterventionStatus getStatus() {
    return status;
  }

  public void setStatus(InterventionStatus status) {
    this.status = status;
  }

  public Long getAssignedTechnicianId() {
    return assignedTechnicianId;
  }

  public void setAssignedTechnicianId(Long assignedTechnicianId) {
    this.assignedTechnicianId = assignedTechnicianId;
  }

  public Instant getScheduledAt() {
    return scheduledAt;
  }

  public void setScheduledAt(Instant scheduledAt) {
    this.scheduledAt = scheduledAt;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  public void setCompletedAt(Instant completedAt) {
    this.completedAt = completedAt;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
