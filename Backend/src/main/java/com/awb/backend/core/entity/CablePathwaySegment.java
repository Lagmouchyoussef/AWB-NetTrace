package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

// The ordered physical route a specific cable takes through pathway segments. Pure routing
// metadata rather than an audit-relevant record on its own - no soft delete / updatedAt here;
// removing a cable's route assignment is a real delete via the repository.
@Entity
@Table(name = "cable_pathway_segments")
public class CablePathwaySegment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cable_id", nullable = false)
  private Cable cable;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pathway_segment_id", nullable = false)
  private PathwaySegment pathwaySegment;

  @Column(name = "sequence_order", nullable = false)
  private Integer sequenceOrder;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public Long getId() {
    return id;
  }

  public Cable getCable() {
    return cable;
  }

  public void setCable(Cable cable) {
    this.cable = cable;
  }

  public PathwaySegment getPathwaySegment() {
    return pathwaySegment;
  }

  public void setPathwaySegment(PathwaySegment pathwaySegment) {
    this.pathwaySegment = pathwaySegment;
  }

  public Integer getSequenceOrder() {
    return sequenceOrder;
  }

  public void setSequenceOrder(Integer sequenceOrder) {
    this.sequenceOrder = sequenceOrder;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
