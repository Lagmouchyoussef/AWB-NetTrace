package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PathTraceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class PathTraceRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private Long sourceDeviceId;

  @NotNull private Long targetDeviceId;

  @NotNull private Integer hopCount;

  private Double totalLengthMeters;

  @NotNull private PathTraceStatus status;

  private Instant tracedAt;

  private String notes;

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

  public Long getTargetDeviceId() {
    return targetDeviceId;
  }

  public void setTargetDeviceId(Long targetDeviceId) {
    this.targetDeviceId = targetDeviceId;
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
}
