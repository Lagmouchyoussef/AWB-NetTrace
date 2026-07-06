package com.awb.backend.core.dto;

import com.awb.backend.core.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserRequest {

  @NotBlank private String username;

  private String password;

  @NotNull private Role role;

  private boolean enabled = true;

  private boolean ipRestrictionEnabled;

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

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public boolean isIpRestrictionEnabled() {
    return ipRestrictionEnabled;
  }

  public void setIpRestrictionEnabled(boolean ipRestrictionEnabled) {
    this.ipRestrictionEnabled = ipRestrictionEnabled;
  }
}
