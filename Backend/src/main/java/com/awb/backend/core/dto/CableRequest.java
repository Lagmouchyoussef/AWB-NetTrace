package com.awb.backend.core.dto;

import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.core.entity.CableType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CableRequest {

  @NotBlank private String name;

  @NotBlank private String code;

  @NotNull private Long sourceDeviceId;

  @NotNull private Long targetDeviceId;

  private Long sourceConnectorId;

  private Long targetConnectorId;

  @NotNull private CableType cableType;

  @NotNull private Double lengthMeters;

  @NotNull private CableStatus status;

  private String notes;

  // Ordered list of pathway segment ids this cable physically traverses - index in the list
  // becomes the traversal sequence order. Nullable/optional; null or empty means "route not yet
  // assigned" and leaves any existing assignment untouched only on create, but REPLACES the
  // existing assignment (to empty) on update if explicitly provided as an empty list. See
  // CableService for the exact replace semantics.
  private List<Long> pathwaySegmentIds;

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

  public Long getSourceDeviceId() {
    return sourceDeviceId;
  }

  public void setSourceDeviceId(Long sourceDeviceId) {
    this.sourceDeviceId = sourceDeviceId;
  }

  public Long getTargetDeviceId() {
    return targetDeviceId;
  }

  public void setTargetDeviceId(Long targetDeviceId) {
    this.targetDeviceId = targetDeviceId;
  }

  public Long getSourceConnectorId() {
    return sourceConnectorId;
  }

  public void setSourceConnectorId(Long sourceConnectorId) {
    this.sourceConnectorId = sourceConnectorId;
  }

  public Long getTargetConnectorId() {
    return targetConnectorId;
  }

  public void setTargetConnectorId(Long targetConnectorId) {
    this.targetConnectorId = targetConnectorId;
  }

  public CableType getCableType() {
    return cableType;
  }

  public void setCableType(CableType cableType) {
    this.cableType = cableType;
  }

  public Double getLengthMeters() {
    return lengthMeters;
  }

  public void setLengthMeters(Double lengthMeters) {
    this.lengthMeters = lengthMeters;
  }

  public CableStatus getStatus() {
    return status;
  }

  public void setStatus(CableStatus status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public List<Long> getPathwaySegmentIds() {
    return pathwaySegmentIds;
  }

  public void setPathwaySegmentIds(List<Long> pathwaySegmentIds) {
    this.pathwaySegmentIds = pathwaySegmentIds;
  }
}
