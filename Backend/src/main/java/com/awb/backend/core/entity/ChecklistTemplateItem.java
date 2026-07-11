package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// System-seeded per InterventionType (see V34 migration) - no admin UI authors these yet, so
// there is no create/update path in the application layer, only the Flyway seed data.
@Entity
@Table(name = "checklist_template_items")
public class ChecklistTemplateItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(name = "intervention_type", nullable = false)
  private InterventionType interventionType;

  @Column(name = "step_order", nullable = false)
  private Integer stepOrder;

  @Column(name = "label", nullable = false)
  private String label;

  public Long getId() {
    return id;
  }

  public InterventionType getInterventionType() {
    return interventionType;
  }

  public void setInterventionType(InterventionType interventionType) {
    this.interventionType = interventionType;
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
}
