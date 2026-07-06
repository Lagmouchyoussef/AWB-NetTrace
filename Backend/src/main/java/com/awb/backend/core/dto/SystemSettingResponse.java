package com.awb.backend.core.dto;

import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.entity.SystemSettingDataType;
import java.time.Instant;

public class SystemSettingResponse {

  private Long id;
  private String settingKey;
  private String settingValue;
  private SystemSettingCategory category;
  private SystemSettingDataType dataType;
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

  public String getSettingKey() {
    return settingKey;
  }

  public void setSettingKey(String settingKey) {
    this.settingKey = settingKey;
  }

  public String getSettingValue() {
    return settingValue;
  }

  public void setSettingValue(String settingValue) {
    this.settingValue = settingValue;
  }

  public SystemSettingCategory getCategory() {
    return category;
  }

  public void setCategory(SystemSettingCategory category) {
    this.category = category;
  }

  public SystemSettingDataType getDataType() {
    return dataType;
  }

  public void setDataType(SystemSettingDataType dataType) {
    this.dataType = dataType;
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
