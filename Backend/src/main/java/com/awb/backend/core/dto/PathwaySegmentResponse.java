package com.awb.backend.core.dto;

import java.time.Instant;

public class PathwaySegmentResponse {

  private Long id;
  private Long pathwayId;
  private String pathwayName;
  private String name;
  private Integer ordinal;
  private Double lengthMeters;
  private Integer capacityCableCount;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  // Computed, non-persisted fill-rate fields.
  private long occupiedCount;
  private double fillRatePercent;
  private boolean overThreshold;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getPathwayId() {
    return pathwayId;
  }

  public void setPathwayId(Long pathwayId) {
    this.pathwayId = pathwayId;
  }

  public String getPathwayName() {
    return pathwayName;
  }

  public void setPathwayName(String pathwayName) {
    this.pathwayName = pathwayName;
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

  public long getOccupiedCount() {
    return occupiedCount;
  }

  public void setOccupiedCount(long occupiedCount) {
    this.occupiedCount = occupiedCount;
  }

  public double getFillRatePercent() {
    return fillRatePercent;
  }

  public void setFillRatePercent(double fillRatePercent) {
    this.fillRatePercent = fillRatePercent;
  }

  public boolean isOverThreshold() {
    return overThreshold;
  }

  public void setOverThreshold(boolean overThreshold) {
    this.overThreshold = overThreshold;
  }
}
