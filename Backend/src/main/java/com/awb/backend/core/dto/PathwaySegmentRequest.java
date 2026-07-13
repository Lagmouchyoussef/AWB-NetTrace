package com.awb.backend.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PathwaySegmentRequest {

  @NotNull private Long pathwayId;

  @NotBlank private String name;

  @NotNull private Integer ordinal;

  private Double lengthMeters;

  // Nullable - when unset, fill-rate for this segment falls back to the parent pathway's
  // capacity.
  private Integer capacityCableCount;

  private String notes;

  public Long getPathwayId() {
    return pathwayId;
  }

  public void setPathwayId(Long pathwayId) {
    this.pathwayId = pathwayId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getOrdinal() {
    return ordinal;
  }

  public void setOrdinal(Integer ordinal) {
    this.ordinal = ordinal;
  }

  public Double getLengthMeters() {
    return lengthMeters;
  }

  public void setLengthMeters(Double lengthMeters) {
    this.lengthMeters = lengthMeters;
  }

  public Integer getCapacityCableCount() {
    return capacityCableCount;
  }

  public void setCapacityCableCount(Integer capacityCableCount) {
    this.capacityCableCount = capacityCableCount;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
