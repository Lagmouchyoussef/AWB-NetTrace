package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "interventions")
public class Intervention {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "device_id", nullable = false)
  private Device device;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "description")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "intervention_type", nullable = false)
  private InterventionType interventionType;

  @Enumerated(EnumType.STRING)
  @Column(name = "priority", nullable = false)
  private InterventionPriority priority;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private InterventionStatus status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assigned_technician_id")
  private User assignedTechnician;

  @Column(name = "scheduled_at", nullable = false)
  private Instant scheduledAt;

  @Column(name = "completed_at")
  private Instant completedAt;

  @Column(name = "notes")
  private String notes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "requested_by")
  private User requestedBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "approved_by")
  private User approvedBy;

  @Enumerated(EnumType.STRING)
  @Column(name = "approval_status", nullable = false)
  private ApprovalStatus approvalStatus = ApprovalStatus.APPROVED;

  @Column(name = "approval_comment")
  private String approvalComment;

  @Column(name = "decided_at")
  private Instant decidedAt;

  @Column(name = "deleted", nullable = false)
  private boolean deleted;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public Device getDevice() {
    return device;
  }

  public void setDevice(Device device) {
    this.device = device;
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

  public User getAssignedTechnician() {
    return assignedTechnician;
  }

  public void setAssignedTechnician(User assignedTechnician) {
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

  public User getRequestedBy() {
    return requestedBy;
  }

  public void setRequestedBy(User requestedBy) {
    this.requestedBy = requestedBy;
  }

  public User getApprovedBy() {
    return approvedBy;
  }

  public void setApprovedBy(User approvedBy) {
    this.approvedBy = approvedBy;
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

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
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
