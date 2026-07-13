package com.awb.backend.core.util;

import com.awb.backend.core.entity.PermissionModule;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

// Maps a /api/roles/{role-slug}/{segment}/... request path to the PermissionModule it belongs
// to, so a single filter can module-gate every entity controller without touching each one.
// Segments with no entry (dashboard, scope, my-account, ai/*, and the bare role-root ping
// endpoints) are intentionally left unmapped - resolve() returns empty for those, and callers
// treat "no module" as always-allowed once authenticated, since gating the shell itself (or the
// AI assistant, which has its own "not configured" story) is out of scope for this feature.
@Component
public class PermissionModuleResolver {

  private static final Pattern ROLE_PATH_PATTERN =
      Pattern.compile("^/api/roles/[a-z-]+/([a-z-]+)(?:/.*)?$");

  private static final Map<String, PermissionModule> SEGMENT_TO_MODULE =
      Map.ofEntries(
          Map.entry("datacenters", PermissionModule.INFRASTRUCTURE),
          Map.entry("rooms", PermissionModule.INFRASTRUCTURE),
          Map.entry("racks", PermissionModule.INFRASTRUCTURE),
          Map.entry("devices", PermissionModule.INFRASTRUCTURE),
          Map.entry("network-roles", PermissionModule.FABRIC),
          Map.entry("overlay-networks", PermissionModule.FABRIC),
          Map.entry("topology-links", PermissionModule.FABRIC),
          Map.entry("cables", PermissionModule.CABLING),
          Map.entry("connectors", PermissionModule.CABLING),
          Map.entry("path-traces", PermissionModule.CABLING),
          Map.entry("carrier-circuits", PermissionModule.SDWAN),
          Map.entry("telemetry-connectors", PermissionModule.TELEMETRY),
          Map.entry("equipment-types", PermissionModule.LIBRARY),
          Map.entry("users", PermissionModule.ADMINISTRATION),
          Map.entry("role-permissions", PermissionModule.ADMINISTRATION),
          Map.entry("system-settings", PermissionModule.ADMINISTRATION),
          Map.entry("permissions", PermissionModule.ADMINISTRATION),
          Map.entry("integration-connectors", PermissionModule.INTEGRATIONS),
          Map.entry("sync-drifts", PermissionModule.INTEGRATIONS),
          Map.entry("audit-logs", PermissionModule.AUDIT),
          Map.entry("reports", PermissionModule.REPORTS),
          Map.entry("interventions", PermissionModule.INTERVENTIONS));

  public Optional<PermissionModule> resolve(String requestPath) {
    Matcher matcher = ROLE_PATH_PATTERN.matcher(requestPath);
    if (!matcher.matches()) {
      return Optional.empty();
    }
    return Optional.ofNullable(SEGMENT_TO_MODULE.get(matcher.group(1)));
  }
}
