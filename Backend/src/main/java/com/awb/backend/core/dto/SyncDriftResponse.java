package com.awb.backend.core.dto;

import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.DriftType;
import com.awb.backend.core.entity.SyncDriftStatus;
import java.time.Instant;

public class SyncDriftResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String title;
  private String description;
  private DriftType driftType;
  private DriftSeverity severity;
  private SyncDriftStatus status;
  private Instant detectedAt;
  private Instant remediatedAt;
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

  public DriftType getDriftType() {
    return driftType;
  }

  public void setDriftType(DriftType driftType) {
    this.driftType = driftType;
  }

  public DriftSeverity getSeverity() {
    return severity;
  }

  public void setSeverity(DriftSeverity severity) {
    this.severity = severity;
  }

  public SyncDriftStatus getStatus() {
    return status;
  }

  public void setStatus(SyncDriftStatus status) {
    this.status = status;
  }

  public Instant getDetectedAt() {
    return detectedAt;
  }

  public void setDetectedAt(Instant detectedAt) {
    this.detectedAt = detectedAt;
  }

  public Instant getRemediatedAt() {
    return remediatedAt;
  }

  public void setRemediatedAt(Instant remediatedAt) {
    this.remediatedAt = remediatedAt;
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
