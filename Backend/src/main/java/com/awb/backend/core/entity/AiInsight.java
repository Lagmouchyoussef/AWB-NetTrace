package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "ai_insights")
public class AiInsight {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(name = "insight_type", nullable = false)
  private AiInsightType insightType;

  @Enumerated(EnumType.STRING)
  @Column(name = "source", nullable = false)
  private AiInsightSource source;

  @Enumerated(EnumType.STRING)
  @Column(name = "severity", nullable = false)
  private AiInsightSeverity severity;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private AiInsightStatus status;

  @Column(name = "entity_type")
  private String entityType;

  @Column(name = "entity_id")
  private Long entityId;

  @Column(name = "entity_name")
  private String entityName;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "summary", nullable = false)
  private String summary;

  @Column(name = "recommended_action")
  private String recommendedAction;

  @Column(name = "confidence")
  private Double confidence;

  @Column(name = "autonomous_action_taken", nullable = false)
  private boolean autonomousActionTaken;

  @Column(name = "action_details")
  private String actionDetails;

  @Column(name = "related_anomaly_id")
  private Long relatedAnomalyId;

  @Column(name = "resolved_at")
  private Instant resolvedAt;

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

  public AiInsightType getInsightType() {
    return insightType;
  }

  public void setInsightType(AiInsightType insightType) {
    this.insightType = insightType;
  }

  public AiInsightSource getSource() {
    return source;
  }

  public void setSource(AiInsightSource source) {
    this.source = source;
  }

  public AiInsightSeverity getSeverity() {
    return severity;
  }

  public void setSeverity(AiInsightSeverity severity) {
    this.severity = severity;
  }

  public AiInsightStatus getStatus() {
    return status;
  }

  public void setStatus(AiInsightStatus status) {
    this.status = status;
  }

  public String getEntityType() {
    return entityType;
  }

  public void setEntityType(String entityType) {
    this.entityType = entityType;
  }

  public Long getEntityId() {
    return entityId;
  }

  public void setEntityId(Long entityId) {
    this.entityId = entityId;
  }

  public String getEntityName() {
    return entityName;
  }

  public void setEntityName(String entityName) {
    this.entityName = entityName;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getRecommendedAction() {
    return recommendedAction;
  }

  public void setRecommendedAction(String recommendedAction) {
    this.recommendedAction = recommendedAction;
  }

  public Double getConfidence() {
    return confidence;
  }

  public void setConfidence(Double confidence) {
    this.confidence = confidence;
  }

  public boolean isAutonomousActionTaken() {
    return autonomousActionTaken;
  }

  public void setAutonomousActionTaken(boolean autonomousActionTaken) {
    this.autonomousActionTaken = autonomousActionTaken;
  }

  public String getActionDetails() {
    return actionDetails;
  }

  public void setActionDetails(String actionDetails) {
    this.actionDetails = actionDetails;
  }

  public Long getRelatedAnomalyId() {
    return relatedAnomalyId;
  }

  public void setRelatedAnomalyId(Long relatedAnomalyId) {
    this.relatedAnomalyId = relatedAnomalyId;
  }

  public Instant getResolvedAt() {
    return resolvedAt;
  }

  public void setResolvedAt(Instant resolvedAt) {
    this.resolvedAt = resolvedAt;
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
