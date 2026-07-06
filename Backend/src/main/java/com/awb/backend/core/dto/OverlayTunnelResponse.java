package com.awb.backend.core.dto;

import com.awb.backend.core.entity.OverlayTunnelStatus;
import com.awb.backend.core.entity.OverlayTunnelType;
import java.time.Instant;

public class OverlayTunnelResponse {

  private Long id;
  private String name;
  private String code;
  private Long sourceEdgeId;
  private String sourceEdgeName;
  private Long targetEdgeId;
  private String targetEdgeName;
  private OverlayTunnelType tunnelType;
  private Integer bandwidthMbps;
  private OverlayTunnelStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public Long getSourceEdgeId() {
    return sourceEdgeId;
  }

  public void setSourceEdgeId(Long sourceEdgeId) {
    this.sourceEdgeId = sourceEdgeId;
  }

  public String getSourceEdgeName() {
    return sourceEdgeName;
  }

  public void setSourceEdgeName(String sourceEdgeName) {
    this.sourceEdgeName = sourceEdgeName;
  }

  public Long getTargetEdgeId() {
    return targetEdgeId;
  }

  public void setTargetEdgeId(Long targetEdgeId) {
    this.targetEdgeId = targetEdgeId;
  }

  public String getTargetEdgeName() {
    return targetEdgeName;
  }

  public void setTargetEdgeName(String targetEdgeName) {
    this.targetEdgeName = targetEdgeName;
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
