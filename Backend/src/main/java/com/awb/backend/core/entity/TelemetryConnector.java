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
@Table(name = "telemetry_connectors")
public class TelemetryConnector {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "device_id", nullable = false)
  private Device device;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Enumerated(EnumType.STRING)
  @Column(name = "protocol", nullable = false)
  private TelemetryProtocol protocol;

  @Column(name = "poll_interval_seconds")
  private Integer pollIntervalSeconds;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private TelemetryConnectorStatus status;

  @Column(name = "last_polled_at")
  private Instant lastPolledAt;

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

  public Device getDevice() {
    return device;
  }

  public void setDevice(Device device) {
    this.device = device;
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

  public TelemetryProtocol getProtocol() {
    return protocol;
  }

  public void setProtocol(TelemetryProtocol protocol) {
    this.protocol = protocol;
  }

  public Integer getPollIntervalSeconds() {
    return pollIntervalSeconds;
  }

  public void setPollIntervalSeconds(Integer pollIntervalSeconds) {
    this.pollIntervalSeconds = pollIntervalSeconds;
  }

  public TelemetryConnectorStatus getStatus() {
    return status;
  }

  public void setStatus(TelemetryConnectorStatus status) {
    this.status = status;
  }

  public Instant getLastPolledAt() {
    return lastPolledAt;
  }

  public void setLastPolledAt(Instant lastPolledAt) {
    this.lastPolledAt = lastPolledAt;
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
