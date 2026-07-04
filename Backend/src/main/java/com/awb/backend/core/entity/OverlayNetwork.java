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
@Table(name = "overlay_networks")
public class OverlayNetwork {

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

  @Column(name = "vni", nullable = false, unique = true)
  private Integer vni;

  @Enumerated(EnumType.STRING)
  @Column(name = "overlay_type", nullable = false)
  private OverlayType overlayType;

  @Column(name = "vlan_id")
  private Integer vlanId;

  @Column(name = "vrf_name")
  private String vrfName;

  @Column(name = "route_distinguisher")
  private String routeDistinguisher;

  @Column(name = "route_targets")
  private String routeTargets;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private OverlayNetworkStatus status;

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
