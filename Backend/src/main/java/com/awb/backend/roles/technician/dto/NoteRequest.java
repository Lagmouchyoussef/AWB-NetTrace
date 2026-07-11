package com.awb.backend.roles.technician.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NoteRequest {

  @NotBlank
  @Size(max = 1000)
  private String body;

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }
}
