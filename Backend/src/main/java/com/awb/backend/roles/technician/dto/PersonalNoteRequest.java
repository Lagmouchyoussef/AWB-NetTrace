package com.awb.backend.roles.technician.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PersonalNoteRequest {

  @Size(max = 150)
  private String title;

  @NotBlank
  @Size(max = 2000)
  private String body;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }
}
