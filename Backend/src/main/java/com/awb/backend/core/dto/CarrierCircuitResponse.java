package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.core.entity.CarrierCircuitType;
import java.time.Instant;

public class CarrierCircuitResponse {

  private Long id;
  private String name;
  private String code;
  private CarrierCircuitType circuitType;
  private String provider;
  private Long terminatesAtConnectorId;
  private String terminatesAtConnectorName;
  private CarrierCircuitStatus status;
  private String notes;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public Long getTerminatesAtConnectorId() {
    return terminatesAtConnectorId;
  }

  public void setTerminatesAtConnectorId(Long terminatesAtConnectorId) {
    this.terminatesAtConnectorId = terminatesAtConnectorId;
  }

  public String getTerminatesAtConnectorName() {
    return terminatesAtConnectorName;
  }

  public void setTerminatesAtConnectorName(String terminatesAtConnectorName) {
    this.terminatesAtConnectorName = terminatesAtConnectorName;
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
