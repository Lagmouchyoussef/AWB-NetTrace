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

// A per-intervention snapshot copied once from ChecklistTemplateItem on first technician access
// (see TechnicianExecutionService.getOrGenerateChecklist) - never re-synced from the template
// afterwards, so completed/in-progress checklists are unaffected by later template edits.
@Entity
@Table(name = "intervention_checklist_items")
public class InterventionChecklistItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "intervention_id", nullable = false)
  private Intervention intervention;

  @Column(name = "step_order", nullable = false)
  private Integer stepOrder;

  @Column(name = "label", nullable = false)
  private String label;

  @Column(name = "completed", nullable = false)
  private boolean completed;

  @Column(name = "completed_at")
  private Instant completedAt;

  public Long getId() {
    return id;
  }

  public Intervention getIntervention() {
    return intervention;
  }

  public void setIntervention(Intervention intervention) {
    this.intervention = intervention;
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
