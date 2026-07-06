package com.awb.backend.core.dto;

import com.awb.backend.core.entity.AutomationType;
import com.awb.backend.core.entity.IntegrationConnectorStatus;
import com.awb.backend.core.entity.IntegrationProtocol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class IntegrationConnectorRequest {

  @NotNull private Long deviceId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private IntegrationProtocol protocol;

  @NotNull private AutomationType automationType;

  @NotNull private IntegrationConnectorStatus status;

  private Instant lastSyncAt;

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

  public IntegrationProtocol getProtocol() {
    return protocol;
  }

  public void setProtocol(IntegrationProtocol protocol) {
    this.protocol = protocol;
  }

  public AutomationType getAutomationType() {
    return automationType;
  }

  public void setAutomationType(AutomationType automationType) {
    this.automationType = automationType;
  }

  public IntegrationConnectorStatus getStatus() {
    return status;
  }

  public void setStatus(IntegrationConnectorStatus status) {
    this.status = status;
  }

  public Instant getLastSyncAt() {
    return lastSyncAt;
  }

  public void setLastSyncAt(Instant lastSyncAt) {
    this.lastSyncAt = lastSyncAt;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
