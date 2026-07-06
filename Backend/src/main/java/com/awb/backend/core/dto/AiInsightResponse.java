package com.awb.backend.core.dto;

import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightSource;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import java.time.Instant;

public class AiInsightResponse {

  private Long id;
  private AiInsightType insightType;
  private AiInsightSource source;
  private AiInsightSeverity severity;
  private AiInsightStatus status;
  private String entityType;
  private Long entityId;
  private String entityName;
  private String title;
  private String summary;
  private String recommendedAction;
  private Double confidence;
  private boolean autonomousActionTaken;
  private String actionDetails;
  private Long relatedAnomalyId;
  private Instant resolvedAt;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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
