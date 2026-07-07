package com.awb.backend.roles.superadmin.service;

import com.awb.backend.core.dto.EffectiveModulePermissionResponse;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.entity.UserPermissionOverride;
import com.awb.backend.core.repository.UserPermissionOverrideRepository;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.core.util.AuditLogWriter;
import com.awb.backend.core.util.PermissionDecisionService;
import com.awb.backend.core.util.PermissionDecisionService.EvaluatedModulePermission;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserPermissionOverrideService {

  private final UserRepository userRepository;
  private final UserPermissionOverrideRepository overrideRepository;
  private final PermissionDecisionService decisionService;
  private final AuditLogWriter auditLogWriter;

  public UserPermissionOverrideService(
      UserRepository userRepository,
      UserPermissionOverrideRepository overrideRepository,
      PermissionDecisionService decisionService,
      AuditLogWriter auditLogWriter) {
    this.userRepository = userRepository;
    this.overrideRepository = overrideRepository;
    this.decisionService = decisionService;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public List<EffectiveModulePermissionResponse> getEffectivePermissions(Long userId) {
    User user = findUserOrThrow(userId);
    return List.of(PermissionModule.values()).stream()
        .map(module -> toResponse(decisionService.evaluate(user, module)))
        .toList();
  }

  @Transactional
  public EffectiveModulePermissionResponse setOverride(
      Long userId,
      PermissionModule module,
      boolean granted,
      String notes,
      String actorUsername) {
    User user = findUserOrThrow(userId);
    UserPermissionOverride override =
        overrideRepository
            .findByUserIdAndModule(userId, module)
            .orElseGet(
                () -> {
                  UserPermissionOverride created = new UserPermissionOverride();
                  created.setUser(user);
                  created.setModule(module);
                  created.setCreatedAt(Instant.now());
                  return created;
                });
    override.setGranted(granted);
    override.setNotes(notes);
    override.setUpdatedAt(Instant.now());
    overrideRepository.save(override);

    auditLogWriter.log(
        actorUsername,
        AuditAction.CONFIG_CHANGE,
        "UserPermissionOverride",
        user.getUsername() + ":" + module + " -> " + (granted ? "GRANTED" : "BLOCKED"),
        notes);

    return toResponse(decisionService.evaluate(user, module));
  }

  @Transactional
  public EffectiveModulePermissionResponse clearOverride(
      Long userId, PermissionModule module, String actorUsername) {
    User user = findUserOrThrow(userId);
    overrideRepository
        .findByUserIdAndModule(userId, module)
        .ifPresent(overrideRepository::delete);

    auditLogWriter.log(
        actorUsername,
        AuditAction.CONFIG_CHANGE,
        "UserPermissionOverride",
        user.getUsername() + ":" + module + " -> INHERIT",
        null);

    return toResponse(decisionService.evaluate(user, module));
  }

  private User findUserOrThrow(Long userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
  }

  private static EffectiveModulePermissionResponse toResponse(EvaluatedModulePermission evaluated) {
    EffectiveModulePermissionResponse response = new EffectiveModulePermissionResponse();
    response.setModule(evaluated.module());
    response.setDefaultAllowed(evaluated.defaultAllowed());
    response.setRoleGranted(evaluated.roleGranted());
    response.setUserOverrideGranted(evaluated.userOverrideGranted());
    response.setEffective(evaluated.effective());
    return response;
  }
}
