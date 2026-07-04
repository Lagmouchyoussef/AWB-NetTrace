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
@Table(name = "topology_links")
public class TopologyLink {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "source_role_id", nullable = false)
  private NetworkRole sourceRole;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "target_role_id", nullable = false)
  private NetworkRole targetRole;

  @Enumerated(EnumType.STRING)
  @Column(name = "link_type", nullable = false)
  private TopologyLinkType linkType;

  @Column(name = "speed_gbps", nullable = false)
  private Integer speedGbps;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private TopologyLinkStatus status;

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

  public NetworkRole getSourceRole() {
    return sourceRole;
  }

  public void setSourceRole(NetworkRole sourceRole) {
    this.sourceRole = sourceRole;
  }

  public NetworkRole getTargetRole() {
    return targetRole;
  }

  public void setTargetRole(NetworkRole targetRole) {
    this.targetRole = targetRole;
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
