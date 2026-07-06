package com.awb.backend.core.dto;

import com.awb.backend.core.entity.PermissionModule;

public class PermissionResponse {

  private Long id;
  private String code;
  private String name;
  private PermissionModule module;
  private String description;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public PermissionModule getModule() {
    return module;
  }

  public void setModule(PermissionModule module) {
    this.module = module;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
