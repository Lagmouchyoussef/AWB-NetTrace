package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PathTraceStatus;
import java.time.Instant;

public class PathTraceResponse {

  private Long id;
  private String name;
  private String code;
  private Long sourceDeviceId;
  private String sourceDeviceName;
  private Long targetDeviceId;
  private String targetDeviceName;
  private Integer hopCount;
  private Double totalLengthMeters;
  private PathTraceStatus status;
  private Instant tracedAt;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

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

  public Integer getHopCount() {
    return hopCount;
  }

  public void setHopCount(Integer hopCount) {
    this.hopCount = hopCount;
  }

  public Double getTotalLengthMeters() {
    return totalLengthMeters;
  }

  public void setTotalLengthMeters(Double totalLengthMeters) {
    this.totalLengthMeters = totalLengthMeters;
  }

  public PathTraceStatus getStatus() {
    return status;
  }

  public void setStatus(PathTraceStatus status) {
    this.status = status;
  }

  public Instant getTracedAt() {
    return tracedAt;
  }

  public void setTracedAt(Instant tracedAt) {
    this.tracedAt = tracedAt;
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
