package com.awb.backend.core.dto;

import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.entity.AnomalyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class AnomalyDetectionRequest {

  @NotNull private Long deviceId;

  @NotBlank private String title;

  private String description;

  @NotNull private AnomalyType anomalyType;

  @NotNull private AnomalySeverity severity;

  @NotNull private AnomalyDetectionStatus status;

  @NotNull private Instant detectedAt;

  private Instant resolvedAt;

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

  public AnomalyType getAnomalyType() {
    return anomalyType;
  }

  public void setAnomalyType(AnomalyType anomalyType) {
    this.anomalyType = anomalyType;
  }

  public AnomalySeverity getSeverity() {
    return severity;
  }

  public void setSeverity(AnomalySeverity severity) {
    this.severity = severity;
  }

  public AnomalyDetectionStatus getStatus() {
    return status;
  }

  public void setStatus(AnomalyDetectionStatus status) {
    this.status = status;
  }

  public Instant getDetectedAt() {
    return detectedAt;
  }

  public void setDetectedAt(Instant detectedAt) {
    this.detectedAt = detectedAt;
  }

  public Instant getResolvedAt() {
    return resolvedAt;
  }

  public void setResolvedAt(Instant resolvedAt) {
    this.resolvedAt = resolvedAt;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
