package com.awb.backend.core.dto;

import com.awb.backend.core.entity.SdwanEdgeStatus;
import java.time.Instant;

public class SdwanEdgeResponse {

  private Long id;
  private Long datacenterId;
  private String datacenterName;
  private String name;
  private String code;
  private String vendor;
  private String model;
  private Integer wanLinkCount;
  private String managementIp;
  private SdwanEdgeStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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
