package com.awb.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

  @NotBlank private String username;

  @NotBlank private String password;

  // Optional: set by role-specific login pages (e.g. /technician-login) so the backend can
  // reject credentials for a different role even before considering them valid.
  private String expectedRole;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getExpectedRole() {
    return expectedRole;
  }

  public void setExpectedRole(String expectedRole) {
    this.expectedRole = expectedRole;
  }
}
