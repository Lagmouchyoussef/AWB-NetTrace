package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.UserRequest;
import com.awb.backend.core.dto.UserResponse;
import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.core.repository.UserSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserManagementService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional(readOnly = true)
  public Page<UserResponse> list(String search, Role role, Pageable pageable) {
    Specification<User> spec =
        Specification.where(UserSpecifications.search(search))
            .and(UserSpecifications.hasRole(role));
    return userRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public UserResponse getById(Long id) {
    return toResponse(findOrThrow(id));
  }

  @Transactional
  public UserResponse create(UserRequest request) {
    if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A user with this username already exists.");
    }
    if (request.getPassword() == null || request.getPassword().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required.");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    user.setEnabled(request.isEnabled());
    user.setIpRestrictionEnabled(request.isIpRestrictionEnabled());
    user.setCreatedAt(Instant.now());
    return toResponse(userRepository.save(user));
  }

  @Transactional
  public UserResponse update(Long id, UserRequest request) {
    User user = findOrThrow(id);
    if (userRepository.existsByUsernameIgnoreCaseAndIdNot(request.getUsername(), id)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A user with this username already exists.");
    }

    user.setUsername(request.getUsername());
    if (request.getPassword() != null && !request.getPassword().isBlank()) {
      user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    }
    user.setRole(request.getRole());
    user.setEnabled(request.isEnabled());
    user.setIpRestrictionEnabled(request.isIpRestrictionEnabled());
    return toResponse(userRepository.save(user));
  }

  @Transactional
  public void delete(Long id) {
    User user = findOrThrow(id);
    userRepository.delete(user);
  }

  private User findOrThrow(Long id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
  }

  private UserResponse toResponse(User user) {
    UserResponse response = new UserResponse();
    response.setId(user.getId());
    response.setUsername(user.getUsername());
    response.setRole(user.getRole());
    response.setEnabled(user.isEnabled());
    response.setIpRestrictionEnabled(user.isIpRestrictionEnabled());
    response.setCreatedAt(user.getCreatedAt());
    return response;
  }
}
