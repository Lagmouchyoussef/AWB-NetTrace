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
@Table(name = "carrier_circuits")
public class CarrierCircuit {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Enumerated(EnumType.STRING)
  @Column(name = "circuit_type", nullable = false)
  private CarrierCircuitType circuitType;

  @Column(name = "provider", nullable = false)
  private String provider;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "terminates_at_connector_id")
  private Connector terminatesAtConnector;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private CarrierCircuitStatus status;

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

  public CarrierCircuitType getCircuitType() {
    return circuitType;
  }

  public void setCircuitType(CarrierCircuitType circuitType) {
    this.circuitType = circuitType;
  }

  public String getProvider() {
    return provider;
  }

  public void setProvider(String provider) {
    this.provider = provider;
  }

  public Connector getTerminatesAtConnector() {
    return terminatesAtConnector;
  }

  public void setTerminatesAtConnector(Connector terminatesAtConnector) {
    this.terminatesAtConnector = terminatesAtConnector;
  }

  public CarrierCircuitStatus getStatus() {
    return status;
  }

  public void setStatus(CarrierCircuitStatus status) {
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
