package com.awb.backend.core.util;

import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.RolePermission;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.entity.UserPermissionOverride;
import com.awb.backend.core.repository.PermissionRepository;
import com.awb.backend.core.repository.RolePermissionRepository;
import com.awb.backend.core.repository.UserPermissionOverrideRepository;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

// The single source of truth for "does this user have access to this module" - used by both
// ModulePermissionFilter (real-time enforcement, one URL at a time) and
// UserPermissionOverrideService (the management UI's "what does this user have access to"
// view), so the two can never drift apart. Precedence: user override > role permission >
// default (today's hardcoded role-territory behavior, preserved so a system with zero explicit
// overrides behaves identically to before this feature existed).
@Component
public class PermissionDecisionService {

  // Which roles' own controllers expose each module today - used only by evaluate() (the UI
  // view), where there's no single incoming URL to check against a role slug. Administration and
  // Integrations are Super-Admin-only; everything else DC Admin also has its own controllers for.
  private static final Map<PermissionModule, Set<Role>> DEFAULT_MODULE_OWNERS =
      Map.ofEntries(
          Map.entry(PermissionModule.INFRASTRUCTURE, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.FABRIC, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.CABLING, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.SDWAN, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.TELEMETRY, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.LIBRARY, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.ADMINISTRATION, Set.of(Role.SUPER_ADMIN)),
          Map.entry(PermissionModule.INTEGRATIONS, Set.of(Role.SUPER_ADMIN)),
          Map.entry(PermissionModule.AUDIT, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.REPORTS, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)),
          Map.entry(PermissionModule.INTERVENTIONS, Set.of(Role.SUPER_ADMIN, Role.DC_ADMIN)));

  private final RolePermissionRepository rolePermissionRepository;
  private final PermissionRepository permissionRepository;
  private final UserPermissionOverrideRepository userPermissionOverrideRepository;

  public PermissionDecisionService(
      RolePermissionRepository rolePermissionRepository,
      PermissionRepository permissionRepository,
      UserPermissionOverrideRepository userPermissionOverrideRepository) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
    this.userPermissionOverrideRepository = userPermissionOverrideRepository;
  }

  public record EvaluatedModulePermission(
      PermissionModule module,
      boolean defaultAllowed,
      Boolean roleGranted,
      Boolean userOverrideGranted,
      boolean effective) {}

  // Used by ModulePermissionFilter: roleSlug comes straight from the incoming request path, so
  // "default" is simply "does this URL's role match the user's own role" - exactly what
  // SecurityConfig's hasRole matchers used to do directly.
  public boolean isGrantedForRequest(User user, String roleSlug, PermissionModule module) {
    boolean defaultAllowed = matchesRoleSlug(roleSlug, user.getRole());
    Boolean userOverrideGranted = findUserOverrideGranted(user.getId(), module);
    if (userOverrideGranted != null) {
      return userOverrideGranted;
    }
    Boolean roleGranted = findRoleGranted(user.getRole(), module);
    if (roleGranted != null) {
      return roleGranted;
    }
    return defaultAllowed;
  }

  // Used by the management UI: no single URL in context, so "default" is whether this module is
  // one the user's role owns anywhere in the app today.
  public EvaluatedModulePermission evaluate(User user, PermissionModule module) {
    boolean defaultAllowed = DEFAULT_MODULE_OWNERS.getOrDefault(module, Set.of()).contains(user.getRole());
    Boolean roleGranted = findRoleGranted(user.getRole(), module);
    Boolean userOverrideGranted = findUserOverrideGranted(user.getId(), module);
    boolean effective;
    if (userOverrideGranted != null) {
      effective = userOverrideGranted;
    } else if (roleGranted != null) {
      effective = roleGranted;
    } else {
      effective = defaultAllowed;
    }
    return new EvaluatedModulePermission(
        module, defaultAllowed, roleGranted, userOverrideGranted, effective);
  }

  private Boolean findUserOverrideGranted(Long userId, PermissionModule module) {
    return userPermissionOverrideRepository
        .findByUserIdAndModule(userId, module)
        .map(UserPermissionOverride::isGranted)
        .orElse(null);
  }

  private Boolean findRoleGranted(Role role, PermissionModule module) {
    return permissionRepository
        .findFirstByModule(module)
        .flatMap(
            (Permission permission) ->
                rolePermissionRepository.findFirstByRoleAndPermissionIdAndDeletedFalse(
                    role, permission.getId()))
        .map(RolePermission::isGranted)
        .orElse(null);
  }

  private static boolean matchesRoleSlug(String roleSlug, Role role) {
    String expected = roleSlug.toUpperCase(Locale.ROOT).replace('-', '_');
    return role.name().equals(expected);
  }
}
