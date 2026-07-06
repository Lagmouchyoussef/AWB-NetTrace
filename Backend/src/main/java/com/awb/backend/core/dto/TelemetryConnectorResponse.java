package com.awb.backend.core.dto;

import com.awb.backend.core.entity.TelemetryConnectorStatus;
import com.awb.backend.core.entity.TelemetryProtocol;
import java.time.Instant;

public class TelemetryConnectorResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String name;
  private String code;
  private TelemetryProtocol protocol;
  private Integer pollIntervalSeconds;
  private TelemetryConnectorStatus status;
  private Instant lastPolledAt;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(Long deviceId) {
    this.deviceId = deviceId;
  }

  public String getDeviceName() {
    return deviceName;
  }

  public void setDeviceName(String deviceName) {
    this.deviceName = deviceName;
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
