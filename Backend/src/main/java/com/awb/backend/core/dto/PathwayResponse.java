package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PathwayStatus;
import com.awb.backend.core.entity.PathwayType;
import java.time.Instant;
import java.util.List;

public class PathwayResponse {

  private Long id;
  private String name;
  private String code;
  private PathwayType type;
  private Long datacenterId;
  private String datacenterName;
  private Long roomId;
  private String roomName;
  private Integer capacityCableCount;
  private Integer fillThresholdPercent;
  private PathwayStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  // Computed, non-persisted fill-rate fields.
  private long occupiedCount;
  private double fillRatePercent;
  private boolean overThreshold;

  // Only populated on the getById/detail response - list responses leave this null for
  // performance.
  private List<PathwaySegmentResponse> segments;

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

  public String getDatacenterName() {
    return datacenterName;
  }

  public void setDatacenterName(String datacenterName) {
    this.datacenterName = datacenterName;
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  public String getRoomName() {
    return roomName;
  }

  public void setRoomName(String roomName) {
    this.roomName = roomName;
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

  public List<PathwaySegmentResponse> getSegments() {
    return segments;
  }

  public void setSegments(List<PathwaySegmentResponse> segments) {
    this.segments = segments;
  }
}
