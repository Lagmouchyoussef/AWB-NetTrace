package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PathwayStatus;
import com.awb.backend.core.entity.PathwayType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PathwayRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private PathwayType type;

  @NotNull private Long datacenterId;

  private Long roomId;

  @NotNull private Integer capacityCableCount;

  // Nullable - defaults to 80 in the service when omitted.
  private Integer fillThresholdPercent;

  @NotNull private PathwayStatus status;

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

  public PathwayType getType() {
    return type;
  }

  public void setType(PathwayType type) {
    this.type = type;
  }

  public Long getDatacenterId() {
    return datacenterId;
  }

  public void setDatacenterId(Long datacenterId) {
    this.datacenterId = datacenterId;
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  public Integer getCapacityCableCount() {
    return capacityCableCount;
  }

  public void setCapacityCableCount(Integer capacityCableCount) {
    this.capacityCableCount = capacityCableCount;
  }

  public Integer getFillThresholdPercent() {
    return fillThresholdPercent;
  }

  public void setFillThresholdPercent(Integer fillThresholdPercent) {
    this.fillThresholdPercent = fillThresholdPercent;
  }

  public PathwayStatus getStatus() {
    return status;
  }

  public void setStatus(PathwayStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
