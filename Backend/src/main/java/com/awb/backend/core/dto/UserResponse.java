package com.awb.backend.core.dto;

import com.awb.backend.core.entity.Role;
import java.time.Instant;

public class UserResponse {

  private Long id;
  private String username;
  private Role role;
  private boolean enabled;
  private boolean ipRestrictionEnabled;
  private Instant createdAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
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

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
