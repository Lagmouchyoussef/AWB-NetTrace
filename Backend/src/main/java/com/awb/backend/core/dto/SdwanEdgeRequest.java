package com.awb.backend.core.dto;

import com.awb.backend.core.entity.SdwanEdgeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SdwanEdgeRequest {

  @NotNull private Long datacenterId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotBlank private String vendor;

  private String model;

  @NotNull private Integer wanLinkCount;

  private String managementIp;

  @NotNull private SdwanEdgeStatus status;

  private String notes;

  public Long getDatacenterId() {
    return datacenterId;
  }

  public void setDatacenterId(Long datacenterId) {
    this.datacenterId = datacenterId;
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

  public String getVendor() {
    return vendor;
  }

  public void setVendor(String vendor) {
    this.vendor = vendor;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public Integer getWanLinkCount() {
    return wanLinkCount;
  }

  public void setWanLinkCount(Integer wanLinkCount) {
    this.wanLinkCount = wanLinkCount;
  }

  public String getManagementIp() {
    return managementIp;
  }

  public void setManagementIp(String managementIp) {
    this.managementIp = managementIp;
  }

  public SdwanEdgeStatus getStatus() {
    return status;
  }

  public void setStatus(SdwanEdgeStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
