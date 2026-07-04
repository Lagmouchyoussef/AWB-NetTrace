package com.awb.backend.core.dto;

import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.DatacenterTier;
import java.time.Instant;

public class DatacenterResponse {

  private Long id;
  private String name;
  private String code;
  private String city;
  private String country;
  private String address;
  private DatacenterTier tier;
  private DatacenterStatus status;
  private Double totalPowerKw;
  private Double totalSpaceSqm;
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

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public DatacenterTier getTier() {
    return tier;
  }

  public void setTier(DatacenterTier tier) {
    this.tier = tier;
  }

  public DatacenterStatus getStatus() {
    return status;
  }

  public void setStatus(DatacenterStatus status) {
    this.status = status;
  }

  public Double getTotalPowerKw() {
    return totalPowerKw;
  }

  public void setTotalPowerKw(Double totalPowerKw) {
    this.totalPowerKw = totalPowerKw;
  }

  public Double getTotalSpaceSqm() {
    return totalSpaceSqm;
  }

  public void setTotalSpaceSqm(Double totalSpaceSqm) {
    this.totalSpaceSqm = totalSpaceSqm;
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
