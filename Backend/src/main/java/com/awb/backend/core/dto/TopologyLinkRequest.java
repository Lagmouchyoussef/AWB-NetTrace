package com.awb.backend.core.dto;

import com.awb.backend.core.entity.TopologyLinkStatus;
import com.awb.backend.core.entity.TopologyLinkType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TopologyLinkRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private Long sourceRoleId;

  @NotNull private Long targetRoleId;

  @NotNull private TopologyLinkType linkType;

  @NotNull private Integer speedGbps;

  @NotNull private TopologyLinkStatus status;

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

  public Long getSourceRoleId() {
    return sourceRoleId;
  }

  public void setSourceRoleId(Long sourceRoleId) {
    this.sourceRoleId = sourceRoleId;
  }

  public Long getTargetRoleId() {
    return targetRoleId;
  }

  public void setTargetRoleId(Long targetRoleId) {
    this.targetRoleId = targetRoleId;
  }

  public TopologyLinkType getLinkType() {
    return linkType;
  }

  public void setLinkType(TopologyLinkType linkType) {
    this.linkType = linkType;
  }

  public Integer getSpeedGbps() {
    return speedGbps;
  }

  public void setSpeedGbps(Integer speedGbps) {
    this.speedGbps = speedGbps;
  }

  public TopologyLinkStatus getStatus() {
    return status;
  }

  public void setStatus(TopologyLinkStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
