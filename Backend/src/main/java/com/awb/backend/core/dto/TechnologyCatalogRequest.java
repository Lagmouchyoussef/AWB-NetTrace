package com.awb.backend.core.dto;

import com.awb.backend.core.entity.TechnologyCatalogStatus;
import com.awb.backend.core.entity.TechnologyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TechnologyCatalogRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private TechnologyCategory category;

  private String vendor;

  private String version;

  private String description;

  @NotNull private TechnologyCatalogStatus status;

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

  public TechnologyCategory getCategory() {
    return category;
  }

  public void setCategory(TechnologyCategory category) {
    this.category = category;
  }

  public String getVendor() {
    return vendor;
  }

  public void setVendor(String vendor) {
    this.vendor = vendor;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public TechnologyCatalogStatus getStatus() {
    return status;
  }

  public void setStatus(TechnologyCatalogStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
