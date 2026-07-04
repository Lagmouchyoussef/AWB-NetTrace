package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "datacenters")
public class Datacenter {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Column(name = "city", nullable = false)
  private String city;

  @Column(name = "country", nullable = false)
  private String country;

  @Column(name = "address")
  private String address;

  @Enumerated(EnumType.STRING)
  @Column(name = "tier", nullable = false)
  private DatacenterTier tier;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private DatacenterStatus status;

  @Column(name = "total_power_kw")
  private Double totalPowerKw;

  @Column(name = "total_space_sqm")
  private Double totalSpaceSqm;

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
