package com.awb.backend.notification;

import java.time.Instant;

// Mirrors DashboardSummaryResponse.ActivityItem's shape so the frontend can reuse the same
// rendering/translation logic for both the polled dashboard feed and the live SSE stream.
public class NotificationPayload {

  private String actorUsername;
  private String action;
  private String entityType;
  private String description;
  private Instant occurredAt;

  public NotificationPayload() {}

  public NotificationPayload(
      String actorUsername, String action, String entityType, String description, Instant occurredAt) {
    this.actorUsername = actorUsername;
    this.action = action;
    this.entityType = entityType;
    this.description = description;
    this.occurredAt = occurredAt;
  }

  public String getActorUsername() {
    return actorUsername;
  }

  public void setActorUsername(String actorUsername) {
    this.actorUsername = actorUsername;
  }

  public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public String getEntityType() {
    return entityType;
  }

  public void setEntityType(String entityType) {
    this.entityType = entityType;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Instant getOccurredAt() {
    return occurredAt;
  }

  public void setOccurredAt(Instant occurredAt) {
    this.occurredAt = occurredAt;
  }
}
