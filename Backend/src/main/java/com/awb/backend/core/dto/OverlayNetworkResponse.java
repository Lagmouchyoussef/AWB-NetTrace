package com.awb.backend.core.dto;

import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.core.entity.OverlayType;
import java.time.Instant;

public class OverlayNetworkResponse {

  private Long id;
  private Long datacenterId;
  private String datacenterName;
  private String name;
  private String code;
  private Integer vni;
  private OverlayType overlayType;
  private Integer vlanId;
  private String vrfName;
  private String routeDistinguisher;
  private String routeTargets;
  private OverlayNetworkStatus status;
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

  public Integer getVni() {
    return vni;
  }

  public void setVni(Integer vni) {
    this.vni = vni;
  }

  public OverlayType getOverlayType() {
    return overlayType;
  }

  public void setOverlayType(OverlayType overlayType) {
    this.overlayType = overlayType;
  }

  public Integer getVlanId() {
    return vlanId;
  }

  public void setVlanId(Integer vlanId) {
    this.vlanId = vlanId;
  }

  public String getVrfName() {
    return vrfName;
  }

  public void setVrfName(String vrfName) {
    this.vrfName = vrfName;
  }

  public String getRouteDistinguisher() {
    return routeDistinguisher;
  }

  public void setRouteDistinguisher(String routeDistinguisher) {
    this.routeDistinguisher = routeDistinguisher;
  }

  public String getRouteTargets() {
    return routeTargets;
  }

  public void setRouteTargets(String routeTargets) {
    this.routeTargets = routeTargets;
  }

  public OverlayNetworkStatus getStatus() {
    return status;
  }

  public void setStatus(OverlayNetworkStatus status) {
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
