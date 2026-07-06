package com.awb.backend.core.dto;

import com.awb.backend.core.entity.ReportFormat;
import com.awb.backend.core.entity.ReportSchedule;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class ReportRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private ReportType reportType;

  @NotNull private ReportFormat format;

  @NotNull private ReportSchedule schedule;

  @NotNull private ReportStatus status;

  private Instant lastGeneratedAt;

  private String description;

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

  public ReportType getReportType() {
    return reportType;
  }

  public void setReportType(ReportType reportType) {
    this.reportType = reportType;
  }

  public ReportFormat getFormat() {
    return format;
  }

  public void setFormat(ReportFormat format) {
    this.format = format;
  }

  public ReportSchedule getSchedule() {
    return schedule;
  }

  public void setSchedule(ReportSchedule schedule) {
    this.schedule = schedule;
  }

  public ReportStatus getStatus() {
    return status;
  }

  public void setStatus(ReportStatus status) {
    this.status = status;
  }

  public Instant getLastGeneratedAt() {
    return lastGeneratedAt;
  }

  public void setLastGeneratedAt(Instant lastGeneratedAt) {
    this.lastGeneratedAt = lastGeneratedAt;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
