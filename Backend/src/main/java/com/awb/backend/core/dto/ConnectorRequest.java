package com.awb.backend.core.dto;

import com.awb.backend.core.entity.ConnectorFormFactor;
import com.awb.backend.core.entity.ConnectorStatus;
import com.awb.backend.core.entity.ConnectorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ConnectorRequest {

  @NotNull private Long deviceId;

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private ConnectorFormFactor formFactor;

  @NotNull private ConnectorType connectorType;

  @NotNull private Integer speedGbps;

  private Integer wavelengthNm;

  @NotNull private ConnectorStatus status;

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
}
