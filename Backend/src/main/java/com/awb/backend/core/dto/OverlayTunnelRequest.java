package com.awb.backend.core.dto;

import com.awb.backend.core.entity.OverlayTunnelStatus;
import com.awb.backend.core.entity.OverlayTunnelType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OverlayTunnelRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private Long sourceEdgeId;

  @NotNull private Long targetEdgeId;

  @NotNull private OverlayTunnelType tunnelType;

  @NotNull private Integer bandwidthMbps;

  @NotNull private OverlayTunnelStatus status;

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

  public Long getSourceEdgeId() {
    return sourceEdgeId;
  }

  public void setSourceEdgeId(Long sourceEdgeId) {
    this.sourceEdgeId = sourceEdgeId;
  }

  public Long getTargetEdgeId() {
    return targetEdgeId;
  }

  public void setTargetEdgeId(Long targetEdgeId) {
    this.targetEdgeId = targetEdgeId;
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
}
