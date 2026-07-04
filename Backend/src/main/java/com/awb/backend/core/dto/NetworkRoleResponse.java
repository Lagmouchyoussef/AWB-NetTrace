package com.awb.backend.core.dto;

import com.awb.backend.core.entity.NetworkRoleStatus;
import com.awb.backend.core.entity.NetworkRoleType;
import java.time.Instant;

public class NetworkRoleResponse {

  private Long id;
  private Long deviceId;
  private String deviceName;
  private String name;
  private String code;
  private NetworkRoleType roleType;
  private Integer asn;
  private String loopbackIp;
  private Integer podNumber;
  private NetworkRoleStatus status;
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

  public NetworkRoleType getRoleType() {
    return roleType;
  }

  public void setRoleType(NetworkRoleType roleType) {
    this.roleType = roleType;
  }

  public Integer getAsn() {
    return asn;
  }

  public void setAsn(Integer asn) {
    this.asn = asn;
  }

  public String getLoopbackIp() {
    return loopbackIp;
  }

  public void setLoopbackIp(String loopbackIp) {
    this.loopbackIp = loopbackIp;
  }

  public Integer getPodNumber() {
    return podNumber;
  }

  public void setPodNumber(Integer podNumber) {
    this.podNumber = podNumber;
  }

  public NetworkRoleStatus getStatus() {
    return status;
  }

  public void setStatus(NetworkRoleStatus status) {
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
