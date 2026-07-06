package com.awb.backend.ai;

import com.anthropic.core.JsonValue;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.repository.AiInsightRepository;
import com.awb.backend.core.repository.AnomalyDetectionRepository;
import com.awb.backend.core.repository.AuditLogRepository;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.RoomRepository;
import com.awb.backend.roles.superadmin.service.DashboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

// Dispatches a tool_use block (by name) to the right repository/service call and returns a JSON
// string result for the chat orchestrator to feed back as a tool_result. Read tools query
// directly (no gating needed); the 2 action tools delegate to AiActionExecutor, which is the
// only place that ever mutates data.
@Component
public class AiToolExecutor {

  private final DatacenterRepository datacenterRepository;
  private final RoomRepository roomRepository;
  private final RackRepository rackRepository;
  private final DeviceRepository deviceRepository;
  private final AnomalyDetectionRepository anomalyDetectionRepository;
  private final InterventionRepository interventionRepository;
  private final AiInsightRepository aiInsightRepository;
  private final AuditLogRepository auditLogRepository;
  private final DashboardService dashboardService;
  private final AiActionExecutor aiActionExecutor;
  private final ObjectMapper objectMapper;

  public AiToolExecutor(
      DatacenterRepository datacenterRepository,
      RoomRepository roomRepository,
      RackRepository rackRepository,
      DeviceRepository deviceRepository,
      AnomalyDetectionRepository anomalyDetectionRepository,
      InterventionRepository interventionRepository,
      AiInsightRepository aiInsightRepository,
      AuditLogRepository auditLogRepository,
      DashboardService dashboardService,
      AiActionExecutor aiActionExecutor,
      ObjectMapper objectMapper) {
    this.datacenterRepository = datacenterRepository;
    this.roomRepository = roomRepository;
    this.rackRepository = rackRepository;
    this.deviceRepository = deviceRepository;
    this.anomalyDetectionRepository = anomalyDetectionRepository;
    this.interventionRepository = interventionRepository;
    this.aiInsightRepository = aiInsightRepository;
    this.auditLogRepository = auditLogRepository;
    this.dashboardService = dashboardService;
    this.aiActionExecutor = aiActionExecutor;
    this.objectMapper = objectMapper;
  }

  public String execute(String toolName, JsonValue input, String actorUsername) {
    try {
      return switch (toolName) {
        case "list_datacenters" -> toJson(listDatacenters());
        case "list_rooms" -> toJson(listRooms(argOrNull(input, "datacenterId")));
        case "list_racks" -> toJson(listRacks(argOrNull(input, "roomId")));
        case "list_devices" -> toJson(listDevices(argOrNull(input, "rackId")));
        case "list_anomalies" -> toJson(listAnomalies(argOrNull(input, "status")));
        case "list_interventions" -> toJson(listInterventions(argOrNull(input, "status")));
        case "list_ai_insights" -> toJson(listAiInsights(argOrNull(input, "status")));
        case "search_audit_log" -> toJson(searchAuditLog(argOrNull(input, "search")));
        case "get_dashboard_summary" -> toJson(dashboardService.getSummary());
        case "create_urgent_intervention" -> handleCreateUrgentIntervention(input, actorUsername);
        case "set_entity_status" -> handleSetEntityStatus(input, actorUsername);
        default -> "Unknown tool: " + toolName;
      };
    } catch (Exception e) {
      return "Error executing " + toolName + ": " + e.getMessage();
    }
  }

  private String handleCreateUrgentIntervention(JsonValue input, String actorUsername) {
    AiActionOutcome outcome =
        aiActionExecutor.createUrgentIntervention(
            Long.valueOf(argOrThrow(input, "deviceId")),
            argOrThrow(input, "title"),
            argOrThrow(input, "description"),
            actorUsername,
            false);
    return outcome.getMessage();
  }

  private String handleSetEntityStatus(JsonValue input, String actorUsername) {
    AiActionOutcome outcome =
        aiActionExecutor.setEntityStatus(
            argOrThrow(input, "entityType"),
            Long.valueOf(argOrThrow(input, "entityId")),
            argOrThrow(input, "newStatus"),
            argOrThrow(input, "reason"),
            actorUsername,
            false);
    return outcome.getMessage();
  }

  private List<Map<String, Object>> listDatacenters() {
    return datacenterRepository.findAll().stream()
        .filter(d -> !d.isDeleted())
        .map(
            d ->
                Map.<String, Object>of(
                    "id", d.getId(),
                    "name", d.getName(),
                    "city", d.getCity(),
                    "tier", d.getTier().name(),
                    "status", d.getStatus().name()))
        .toList();
  }

  private List<Map<String, Object>> listRooms(String datacenterId) {
    return roomRepository.findAll().stream()
        .filter(r -> !r.isDeleted())
        .filter(
            r -> datacenterId == null || r.getDatacenter().getId().toString().equals(datacenterId))
        .map(
            r ->
                Map.<String, Object>of(
                    "id", r.getId(),
                    "name", r.getName(),
                    "datacenter", r.getDatacenter().getName(),
                    "roomType", r.getRoomType().name(),
                    "status", r.getStatus().name()))
        .toList();
  }

  private List<Map<String, Object>> listRacks(String roomId) {
    return rackRepository.findAll().stream()
        .filter(r -> !r.isDeleted())
        .filter(r -> roomId == null || r.getRoom().getId().toString().equals(roomId))
        .map(
            r ->
                Map.<String, Object>of(
                    "id", r.getId(),
                    "name", r.getName(),
                    "room", r.getRoom().getName(),
                    "powerCapacityKw", r.getPowerCapacityKw(),
                    "currentPowerDrawKw", r.getCurrentPowerDrawKw(),
                    "status", r.getStatus().name()))
        .toList();
  }

  private List<Map<String, Object>> listDevices(String rackId) {
    return deviceRepository.findAll().stream()
        .filter(d -> !d.isDeleted())
        .filter(d -> rackId == null || d.getRack().getId().toString().equals(rackId))
        .map(
            d ->
                Map.<String, Object>of(
                    "id", d.getId(),
                    "name", d.getName(),
                    "rack", d.getRack().getName(),
                    "deviceType", d.getDeviceType().name(),
                    "status", d.getStatus().name()))
        .toList();
  }

  private List<Map<String, Object>> listAnomalies(String status) {
    return anomalyDetectionRepository.findAll().stream()
        .filter(a -> !a.isDeleted())
        .filter(a -> status == null || a.getStatus() == AnomalyDetectionStatus.valueOf(status))
        .map(
            a ->
                Map.<String, Object>of(
                    "id", a.getId(),
                    "title", a.getTitle(),
                    "device", a.getDevice().getName(),
                    "severity", a.getSeverity().name(),
                    "status", a.getStatus().name(),
                    "detectedAt", a.getDetectedAt().toString()))
        .toList();
  }

  private List<Map<String, Object>> listInterventions(String status) {
    return interventionRepository.findAll().stream()
        .filter(i -> !i.isDeleted())
        .filter(i -> status == null || i.getStatus() == InterventionStatus.valueOf(status))
        .map(
            i ->
                Map.<String, Object>of(
                    "id", i.getId(),
                    "title", i.getTitle(),
                    "device", i.getDevice().getName(),
                    "priority", i.getPriority().name(),
                    "status", i.getStatus().name()))
        .toList();
  }

  private List<Map<String, Object>> listAiInsights(String status) {
    return aiInsightRepository.findAll().stream()
        .filter(i -> !i.isDeleted())
        .filter(i -> status == null || i.getStatus() == AiInsightStatus.valueOf(status))
        .map(
            i ->
                Map.<String, Object>of(
                    "id", i.getId(),
                    "title", i.getTitle(),
                    "severity", i.getSeverity().name(),
                    "status", i.getStatus().name(),
                    "entityType", i.getEntityType() == null ? "" : i.getEntityType(),
                    "entityName", i.getEntityName() == null ? "" : i.getEntityName()))
        .toList();
  }

  private List<Map<String, Object>> searchAuditLog(String search) {
    return auditLogRepository.findAll().stream()
        .filter(a -> !a.isDeleted())
        .filter(
            a ->
                search == null
                    || (a.getDescription() != null
                        && a.getDescription().toLowerCase().contains(search.toLowerCase())))
        .sorted((a, b) -> b.getOccurredAt().compareTo(a.getOccurredAt()))
        .limit(20)
        .map(
            a ->
                Map.<String, Object>of(
                    "actor", a.getActorUsername(),
                    "action", a.getAction().name(),
                    "entityType", a.getEntityType(),
                    "description", a.getDescription() == null ? "" : a.getDescription(),
                    "occurredAt", a.getOccurredAt().toString()))
        .toList();
  }

  private String toJson(Object value) {
    try {
      return objectMapper.writeValueAsString(value);
    } catch (Exception e) {
      return "{}";
    }
  }

  private static String argOrNull(JsonValue input, String key) {
    java.util.Optional<Map<String, JsonValue>> obj = input.asObject();
    if (obj.isEmpty()) {
      return null;
    }
    JsonValue value = obj.get().get(key);
    return value == null ? null : value.asStringOrThrow();
  }

  private static String argOrThrow(JsonValue input, String key) {
    String value = argOrNull(input, key);
    if (value == null) {
      throw new IllegalArgumentException("Missing required argument: " + key);
    }
    return value;
  }
}
