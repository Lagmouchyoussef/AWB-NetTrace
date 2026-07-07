package com.awb.backend.core.dto;

import jakarta.validation.constraints.NotBlank;

public class InterventionRejectRequest {

  @NotBlank private String comment;

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }
}
