package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "sdwan_edges")
public class SdwanEdge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "datacenter_id", nullable = false)
  private Datacenter datacenter;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Column(name = "vendor", nullable = false)
  private String vendor;

  @Column(name = "model")
  private String model;

  @Column(name = "wan_link_count", nullable = false)
  private Integer wanLinkCount;

  @Column(name = "management_ip")
  private String managementIp;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private SdwanEdgeStatus status;

  @Column(name = "notes")
  private String notes;

  @Column(name = "deleted", nullable = false)
  private boolean deleted;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public Datacenter getDatacenter() {
    return datacenter;
  }

  public void setDatacenter(Datacenter datacenter) {
    this.datacenter = datacenter;
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

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
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
