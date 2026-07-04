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
@Table(name = "cables")
public class Cable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "source_device_id", nullable = false)
  private Device sourceDevice;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "target_device_id", nullable = false)
  private Device targetDevice;

  @Enumerated(EnumType.STRING)
  @Column(name = "cable_type", nullable = false)
  private CableType cableType;

  @Column(name = "length_meters", nullable = false)
  private Double lengthMeters;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private CableStatus status;

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

  public Device getSourceDevice() {
    return sourceDevice;
  }

  public void setSourceDevice(Device sourceDevice) {
    this.sourceDevice = sourceDevice;
  }

  public Device getTargetDevice() {
    return targetDevice;
  }

  public void setTargetDevice(Device targetDevice) {
    this.targetDevice = targetDevice;
  }

  public CableType getCableType() {
    return cableType;
  }

  public void setCableType(CableType cableType) {
    this.cableType = cableType;
  }

  public Double getLengthMeters() {
    return lengthMeters;
  }

  public void setLengthMeters(Double lengthMeters) {
    this.lengthMeters = lengthMeters;
  }

  public CableStatus getStatus() {
    return status;
  }

  public void setStatus(CableStatus status) {
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
