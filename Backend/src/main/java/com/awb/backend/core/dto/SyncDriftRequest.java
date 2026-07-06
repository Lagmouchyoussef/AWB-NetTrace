package com.awb.backend.core.dto;

import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.DriftType;
import com.awb.backend.core.entity.SyncDriftStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class SyncDriftRequest {

  @NotNull private Long deviceId;

  @NotBlank private String title;

  private String description;

  @NotNull private DriftType driftType;

  @NotNull private DriftSeverity severity;

  @NotNull private SyncDriftStatus status;

  @NotNull private Instant detectedAt;

  private Instant remediatedAt;

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
}
