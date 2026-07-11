package com.awb.backend.core.dto;

import com.awb.backend.core.entity.ApprovalStatus;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import java.time.Instant;

public class InterventionResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String rackName;
  private String datacenterName;
  private String title;
  private String description;
  private InterventionType interventionType;
  private InterventionPriority priority;
  private InterventionStatus status;
  private Long assignedTechnicianId;
  private String assignedTechnicianUsername;
  private Instant scheduledAt;
  private Instant completedAt;
  private String notes;
  private Long requestedById;
  private String requestedByUsername;
  private Long approvedById;
  private String approvedByUsername;
  private ApprovalStatus approvalStatus;
  private String approvalComment;
  private Instant decidedAt;
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

  public String getRackName() {
    return rackName;
  }

  public void setRackName(String rackName) {
    this.rackName = rackName;
  }

  public String getDatacenterName() {
    return datacenterName;
  }

  public void setDatacenterName(String datacenterName) {
    this.datacenterName = datacenterName;
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

  public String getAssignedTechnicianUsername() {
    return assignedTechnicianUsername;
  }

  public void setAssignedTechnicianUsername(String assignedTechnicianUsername) {
    this.assignedTechnicianUsername = assignedTechnicianUsername;
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

  public Long getRequestedById() {
    return requestedById;
  }

  public void setRequestedById(Long requestedById) {
    this.requestedById = requestedById;
  }

  public String getRequestedByUsername() {
    return requestedByUsername;
  }

  public void setRequestedByUsername(String requestedByUsername) {
    this.requestedByUsername = requestedByUsername;
  }

  public Long getApprovedById() {
    return approvedById;
  }

  public void setApprovedById(Long approvedById) {
    this.approvedById = approvedById;
  }

  public String getApprovedByUsername() {
    return approvedByUsername;
  }

  public void setApprovedByUsername(String approvedByUsername) {
    this.approvedByUsername = approvedByUsername;
  }

  public ApprovalStatus getApprovalStatus() {
    return approvalStatus;
  }

  public void setApprovalStatus(ApprovalStatus approvalStatus) {
    this.approvalStatus = approvalStatus;
  }

  public String getApprovalComment() {
    return approvalComment;
  }

  public void setApprovalComment(String approvalComment) {
    this.approvalComment = approvalComment;
  }

  public Instant getDecidedAt() {
    return decidedAt;
  }

  public void setDecidedAt(Instant decidedAt) {
    this.decidedAt = decidedAt;
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
