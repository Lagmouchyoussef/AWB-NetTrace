package com.awb.backend.core.dto;

import com.awb.backend.core.entity.TelemetryConnectorStatus;
import com.awb.backend.core.entity.TelemetryProtocol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class TelemetryConnectorRequest {

  @NotNull private Long deviceId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private TelemetryProtocol protocol;

  private Integer pollIntervalSeconds;

  @NotNull private TelemetryConnectorStatus status;

  private Instant lastPolledAt;

  private String notes;

  public Long getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(Long deviceId) {
    this.deviceId = deviceId;
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
}
