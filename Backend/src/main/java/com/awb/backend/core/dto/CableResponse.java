package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.core.entity.CableType;
import java.time.Instant;
import java.util.List;

public class CableResponse {

  private Long id;
  private String name;
  private String code;
  private Long sourceDeviceId;
  private String sourceDeviceName;
  private Long targetDeviceId;
  private String targetDeviceName;
  private Long sourceConnectorId;
  private String sourceConnectorName;
  private Long targetConnectorId;
  private String targetConnectorName;
  private CableType cableType;
  private Double lengthMeters;
  private CableStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  // Ordered list reflecting this cable's current physical route assignment through pathway
  // segments.
  private List<PathwaySegmentResponse> pathwaySegments;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Long getSourceDeviceId() {
    return sourceDeviceId;
  }

  public void setSourceDeviceId(Long sourceDeviceId) {
    this.sourceDeviceId = sourceDeviceId;
  }

  public String getSourceDeviceName() {
    return sourceDeviceName;
  }

  public void setSourceDeviceName(String sourceDeviceName) {
    this.sourceDeviceName = sourceDeviceName;
  }

  public Long getTargetDeviceId() {
    return targetDeviceId;
  }

  public void setTargetDeviceId(Long targetDeviceId) {
    this.targetDeviceId = targetDeviceId;
  }

  public String getTargetDeviceName() {
    return targetDeviceName;
  }

  public void setTargetDeviceName(String targetDeviceName) {
    this.targetDeviceName = targetDeviceName;
  }

  public Long getSourceConnectorId() {
    return sourceConnectorId;
  }

  public void setSourceConnectorId(Long sourceConnectorId) {
    this.sourceConnectorId = sourceConnectorId;
  }

  public String getSourceConnectorName() {
    return sourceConnectorName;
  }

  public void setSourceConnectorName(String sourceConnectorName) {
    this.sourceConnectorName = sourceConnectorName;
  }

  public Long getTargetConnectorId() {
    return targetConnectorId;
  }

  public void setTargetConnectorId(Long targetConnectorId) {
    this.targetConnectorId = targetConnectorId;
  }

  public String getTargetConnectorName() {
    return targetConnectorName;
  }

  public void setTargetConnectorName(String targetConnectorName) {
    this.targetConnectorName = targetConnectorName;
  }

  public CableType getCableType() {
    return cableType;
  }

  public void setCableType(CableType cableType) {
    this.cableType = cableType;
  }

  public Double getLengthMeters() {
    return lengthMeters;
  }

  public void setLengthMeters(Double lengthMeters) {
    this.lengthMeters = lengthMeters;
  }

  public CableStatus getStatus() {
    return status;
  }

  public void setStatus(CableStatus status) {
    this.status = status;
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

  public List<PathwaySegmentResponse> getPathwaySegments() {
    return pathwaySegments;
  }

  public void setPathwaySegments(List<PathwaySegmentResponse> pathwaySegments) {
    this.pathwaySegments = pathwaySegments;
  }
}
