package com.awb.backend.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "intervention_photos")
public class InterventionPhoto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "intervention_id", nullable = false)
  private Intervention intervention;

  @Enumerated(EnumType.STRING)
  @Column(name = "phase", nullable = false)
  private InterventionPhotoPhase phase;

  // Disk file name (a generated UUID + extension), not the original upload name - never trust
  // client-supplied file names as a storage path component.
  @Column(name = "stored_file_name", nullable = false)
  private String storedFileName;

  @Column(name = "content_type", nullable = false)
  private String contentType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "uploaded_by", nullable = false)
  private User uploadedBy;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  public Long getId() {
    return id;
  }

  public Intervention getIntervention() {
    return intervention;
  }

  public void setIntervention(Intervention intervention) {
    this.intervention = intervention;
  }

  public InterventionPhotoPhase getPhase() {
    return phase;
  }

  public void setPhase(InterventionPhotoPhase phase) {
    this.phase = phase;
  }

  public String getStoredFileName() {
    return storedFileName;
  }

  public void setStoredFileName(String storedFileName) {
    this.storedFileName = storedFileName;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public User getUploadedBy() {
    return uploadedBy;
  }

  public void setUploadedBy(User uploadedBy) {
    this.uploadedBy = uploadedBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
