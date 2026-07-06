package com.awb.backend.core.dto;

import com.awb.backend.core.entity.RealTimeDashboardStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RealTimeDashboardRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  private String description;

  @NotNull private Integer refreshIntervalSeconds;

  @NotNull private Integer widgetCount;

  @NotNull private RealTimeDashboardStatus status;

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
}
