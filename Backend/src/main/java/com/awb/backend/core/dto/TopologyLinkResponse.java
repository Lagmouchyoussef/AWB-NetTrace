package com.awb.backend.core.dto;

import com.awb.backend.core.entity.TopologyLinkStatus;
import com.awb.backend.core.entity.TopologyLinkType;
import java.time.Instant;

public class TopologyLinkResponse {

  private Long id;
  private String name;
  private String code;
  private Long sourceRoleId;
  private String sourceRoleName;
  private Long targetRoleId;
  private String targetRoleName;
  private TopologyLinkType linkType;
  private Integer speedGbps;
  private TopologyLinkStatus status;
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

  public Long getSourceRoleId() {
    return sourceRoleId;
  }

  public void setSourceRoleId(Long sourceRoleId) {
    this.sourceRoleId = sourceRoleId;
  }

  public String getSourceRoleName() {
    return sourceRoleName;
  }

  public void setSourceRoleName(String sourceRoleName) {
    this.sourceRoleName = sourceRoleName;
  }

  public Long getTargetRoleId() {
    return targetRoleId;
  }

  public void setTargetRoleId(Long targetRoleId) {
    this.targetRoleId = targetRoleId;
  }

  public String getTargetRoleName() {
    return targetRoleName;
  }

  public void setTargetRoleName(String targetRoleName) {
    this.targetRoleName = targetRoleName;
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
