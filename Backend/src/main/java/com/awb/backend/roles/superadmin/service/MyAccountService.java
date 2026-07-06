package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.AllowedIpRequest;
import com.awb.backend.core.dto.AllowedIpResponse;
import com.awb.backend.core.dto.ChangePasswordRequest;
import com.awb.backend.core.dto.MyAccountResponse;
import com.awb.backend.core.dto.MyAccountUpdateRequest;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.entity.UserAllowedIp;
import com.awb.backend.core.repository.UserAllowedIpRepository;
import com.awb.backend.core.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MyAccountService {

  private final UserRepository userRepository;
  private final UserAllowedIpRepository userAllowedIpRepository;
  private final PasswordEncoder passwordEncoder;

  public MyAccountService(
      UserRepository userRepository,
      UserAllowedIpRepository userAllowedIpRepository,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.userAllowedIpRepository = userAllowedIpRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional(readOnly = true)
  public MyAccountResponse getMyAccount(String username) {
    return toResponse(findUserOrThrow(username));
  }

  @Transactional
  public MyAccountResponse updateMyAccount(String username, MyAccountUpdateRequest request) {
    User user = findUserOrThrow(username);
    if (!user.getUsername().equalsIgnoreCase(request.getUsername())
        && userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "A user with this username already exists.");
    }

    user.setUsername(request.getUsername());
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setMatricule(request.getMatricule());
    user.setProfilePhoto(request.getProfilePhoto());
    return toResponse(userRepository.save(user));
  }

  @Transactional
  public void changePassword(String username, ChangePasswordRequest request) {
    User user = findUserOrThrow(username);
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
    }
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  @Transactional
  public void setIpRestrictionEnabled(String username, boolean enabled) {
    User user = findUserOrThrow(username);
    user.setIpRestrictionEnabled(enabled);
    userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public List<AllowedIpResponse> listAllowedIps(String username) {
    User user = findUserOrThrow(username);
    return userAllowedIpRepository.findByUserId(user.getId()).stream()
        .map(this::toAllowedIpResponse)
        .toList();
  }

  @Transactional
  public AllowedIpResponse addAllowedIp(String username, AllowedIpRequest request) {
    User user = findUserOrThrow(username);
    UserAllowedIp allowedIp = new UserAllowedIp();
    allowedIp.setUserId(user.getId());
    allowedIp.setIpAddress(request.getIpAddress());
    allowedIp.setCreatedAt(Instant.now());
    return toAllowedIpResponse(userAllowedIpRepository.save(allowedIp));
  }

  @Transactional
  public void deleteAllowedIp(String username, Long allowedIpId) {
    User user = findUserOrThrow(username);
    UserAllowedIp allowedIp =
        userAllowedIpRepository
            .findById(allowedIpId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Allowed IP not found."));
    if (!allowedIp.getUserId().equals(user.getId())) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Allowed IP not found.");
    }
    userAllowedIpRepository.delete(allowedIp);
  }

  private User findUserOrThrow(String username) {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
  }

  private MyAccountResponse toResponse(User user) {
    MyAccountResponse response = new MyAccountResponse();
    response.setId(user.getId());
    response.setUsername(user.getUsername());
    response.setFullName(user.getFullName());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setMatricule(user.getMatricule());
    response.setProfilePhoto(user.getProfilePhoto());
    response.setRole(user.getRole());
    response.setEnabled(user.isEnabled());
    response.setIpRestrictionEnabled(user.isIpRestrictionEnabled());
    response.setCreatedAt(user.getCreatedAt());
    return response;
  }

  private AllowedIpResponse toAllowedIpResponse(UserAllowedIp allowedIp) {
    AllowedIpResponse response = new AllowedIpResponse();
    response.setId(allowedIp.getId());
    response.setIpAddress(allowedIp.getIpAddress());
    response.setCreatedAt(allowedIp.getCreatedAt());
    return response;
  }
}
