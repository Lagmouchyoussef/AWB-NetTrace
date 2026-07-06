package com.awb.backend.core.dto;

import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.entity.SystemSettingDataType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SystemSettingRequest {

  @NotBlank private String settingKey;

  private String settingValue;

  @NotNull private SystemSettingCategory category;

  @NotNull private SystemSettingDataType dataType;

  private String description;

  private String notes;

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
}
