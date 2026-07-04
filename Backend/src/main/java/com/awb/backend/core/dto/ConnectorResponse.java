package com.awb.backend.core.dto;

import com.awb.backend.core.entity.ConnectorFormFactor;
import com.awb.backend.core.entity.ConnectorStatus;
import com.awb.backend.core.entity.ConnectorType;
import java.time.Instant;

public class ConnectorResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String name;
  private String code;
  private ConnectorFormFactor formFactor;
  private ConnectorType connectorType;
  private Integer speedGbps;
  private Integer wavelengthNm;
  private ConnectorStatus status;
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

  public ConnectorFormFactor getFormFactor() {
    return formFactor;
  }

  public void setFormFactor(ConnectorFormFactor formFactor) {
    this.formFactor = formFactor;
  }

  public ConnectorType getConnectorType() {
    return connectorType;
  }

  public void setConnectorType(ConnectorType connectorType) {
    this.connectorType = connectorType;
  }

  public Integer getSpeedGbps() {
    return speedGbps;
  }

  public void setSpeedGbps(Integer speedGbps) {
    this.speedGbps = speedGbps;
  }

  public Integer getWavelengthNm() {
    return wavelengthNm;
  }

  public void setWavelengthNm(Integer wavelengthNm) {
    this.wavelengthNm = wavelengthNm;
  }

  public ConnectorStatus getStatus() {
    return status;
  }

  public void setStatus(ConnectorStatus status) {
    this.status = status;
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
