package com.awb.backend.core.dto;

import com.awb.backend.core.entity.RealTimeDashboardStatus;
import java.time.Instant;

public class RealTimeDashboardResponse {

  private Long id;
  private String name;
  private String code;
  private String description;
  private Integer refreshIntervalSeconds;
  private Integer widgetCount;
  private RealTimeDashboardStatus status;
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getRefreshIntervalSeconds() {
    return refreshIntervalSeconds;
  }

  public void setRefreshIntervalSeconds(Integer refreshIntervalSeconds) {
    this.refreshIntervalSeconds = refreshIntervalSeconds;
  }

  public Integer getWidgetCount() {
    return widgetCount;
  }

  public void setWidgetCount(Integer widgetCount) {
    this.widgetCount = widgetCount;
  }

  public RealTimeDashboardStatus getStatus() {
    return status;
  }

  public void setStatus(RealTimeDashboardStatus status) {
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
}
