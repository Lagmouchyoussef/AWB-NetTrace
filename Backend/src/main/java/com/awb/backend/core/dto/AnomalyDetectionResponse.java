package com.awb.backend.core.dto;

import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.entity.AnomalyType;
import java.time.Instant;

public class AnomalyDetectionResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String title;
  private String description;
  private AnomalyType anomalyType;
  private AnomalySeverity severity;
  private AnomalyDetectionStatus status;
  private Instant detectedAt;
  private Instant resolvedAt;
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
