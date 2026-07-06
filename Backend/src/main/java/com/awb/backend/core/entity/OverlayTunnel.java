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
@Table(name = "overlay_tunnels")
public class OverlayTunnel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "source_edge_id", nullable = false)
  private SdwanEdge sourceEdge;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "target_edge_id", nullable = false)
  private SdwanEdge targetEdge;

  @Enumerated(EnumType.STRING)
  @Column(name = "tunnel_type", nullable = false)
  private OverlayTunnelType tunnelType;

  @Column(name = "bandwidth_mbps", nullable = false)
  private Integer bandwidthMbps;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private OverlayTunnelStatus status;

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

  public SdwanEdge getSourceEdge() {
    return sourceEdge;
  }

  public void setSourceEdge(SdwanEdge sourceEdge) {
    this.sourceEdge = sourceEdge;
  }

  public SdwanEdge getTargetEdge() {
    return targetEdge;
  }

  public void setTargetEdge(SdwanEdge targetEdge) {
    this.targetEdge = targetEdge;
  }

  public OverlayTunnelType getTunnelType() {
    return tunnelType;
  }

  public void setTunnelType(OverlayTunnelType tunnelType) {
    this.tunnelType = tunnelType;
  }

  public Integer getBandwidthMbps() {
    return bandwidthMbps;
  }

  public void setBandwidthMbps(Integer bandwidthMbps) {
    this.bandwidthMbps = bandwidthMbps;
  }

  public OverlayTunnelStatus getStatus() {
    return status;
  }

  public void setStatus(OverlayTunnelStatus status) {
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
