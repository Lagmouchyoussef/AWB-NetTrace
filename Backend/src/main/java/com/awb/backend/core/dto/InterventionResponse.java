package com.awb.backend.core.dto;

import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import java.time.Instant;

public class InterventionResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String title;
  private String description;
  private InterventionType interventionType;
  private InterventionPriority priority;
  private InterventionStatus status;
  private String assignedTechnician;
  private Instant scheduledAt;
  private Instant completedAt;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(Long deviceId) {
    this.deviceId = deviceId;
  }

  public String getDeviceName() {
    return deviceName;
  }

  public void setDeviceName(String deviceName) {
    this.deviceName = deviceName;
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

  public String getAssignedTechnician() {
    return assignedTechnician;
  }

  public void setAssignedTechnician(String assignedTechnician) {
    this.assignedTechnician = assignedTechnician;
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
