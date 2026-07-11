package com.awb.backend.roles.technician.dto;

import java.time.Instant;

public class ChecklistItemResponse {

  private Long id;
  private Integer stepOrder;
  private String label;
  private boolean completed;
  private Instant completedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Integer getStepOrder() {
    return stepOrder;
  }

  public void setStepOrder(Integer stepOrder) {
    this.stepOrder = stepOrder;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public boolean isCompleted() {
    return completed;
  }

  public void setCompleted(boolean completed) {
    this.completed = completed;
  }

  public Instant getCompletedAt() {
    return completedAt;
  }

  public void setCompletedAt(Instant completedAt) {
    this.completedAt = completedAt;
  }
}
