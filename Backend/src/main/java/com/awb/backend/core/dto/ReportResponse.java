package com.awb.backend.core.dto;

import com.awb.backend.core.entity.ReportFormat;
import com.awb.backend.core.entity.ReportSchedule;
import com.awb.backend.core.entity.ReportStatus;
import com.awb.backend.core.entity.ReportType;
import java.time.Instant;

public class ReportResponse {

  private Long id;
  private String name;
  private String code;
  private ReportType reportType;
  private ReportFormat format;
  private ReportSchedule schedule;
  private ReportStatus status;
  private Instant lastGeneratedAt;
  private String description;
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
