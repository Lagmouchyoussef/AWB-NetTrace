package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.core.entity.CarrierCircuitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CarrierCircuitRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private CarrierCircuitType circuitType;

  @NotBlank private String provider;

  private Long terminatesAtConnectorId;

  @NotNull private CarrierCircuitStatus status;

  private String notes;

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

  public Long getTerminatesAtConnectorId() {
    return terminatesAtConnectorId;
  }

  public void setTerminatesAtConnectorId(Long terminatesAtConnectorId) {
    this.terminatesAtConnectorId = terminatesAtConnectorId;
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
}
