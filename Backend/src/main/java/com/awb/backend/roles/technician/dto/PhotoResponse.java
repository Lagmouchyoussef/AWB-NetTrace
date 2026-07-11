package com.awb.backend.roles.technician.dto;

import com.awb.backend.core.entity.InterventionPhotoPhase;
import java.time.Instant;

public class PhotoResponse {

  private Long id;
  private InterventionPhotoPhase phase;
  private String contentType;
  private String uploadedByUsername;
  private Instant createdAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public InterventionPhotoPhase getPhase() {
    return phase;
  }

  public void setPhase(InterventionPhotoPhase phase) {
    this.phase = phase;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public String getUploadedByUsername() {
    return uploadedByUsername;
  }

  public void setUploadedByUsername(String uploadedByUsername) {
    this.uploadedByUsername = uploadedByUsername;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
