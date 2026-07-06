package com.awb.backend.ai;

import com.awb.backend.core.entity.AiInsight;
import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightSource;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.entity.RackStatus;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.repository.AiInsightRepository;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.RoomRepository;
import com.awb.backend.core.repository.SystemSettingRepository;
import com.awb.backend.core.util.AuditLogWriter;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// The single safety-gate choke point for AI-driven mutations, used identically by the chat
// tool executor and the scheduled predictive-analysis job. When ai.autonomous_actions.enabled
// is false, actions are never applied - they are only logged as pending AiInsight
// recommendations for a human to review and apply. A human clicking "Apply" in the UI always
// executes (forceApply=true), since a supervised action is not "autonomous" by definition.
@Component
public class AiActionExecutor {

  private static final String AUTONOMOUS_ACTIONS_SETTING_KEY = "ai.autonomous_actions.enabled";

  // Machine-readable markers stashed in a pending (not-yet-applied) insight's actionDetails,
  // so AiInsightService#apply() knows which action to execute without re-parsing free text.
  public static final String PENDING_CREATE_INTERVENTION =
      "PENDING_REMEDIATION:CREATE_INTERVENTION";
  public static final String PENDING_SET_STATUS_PREFIX = "PENDING_REMEDIATION:SET_STATUS:";

  private final SystemSettingRepository systemSettingRepository;
  private final DeviceRepository deviceRepository;
  private final RackRepository rackRepository;
  private final RoomRepository roomRepository;
  private final InterventionRepository interventionRepository;
  private final AiInsightRepository aiInsightRepository;
  private final AuditLogWriter auditLogWriter;

  public AiActionExecutor(
      SystemSettingRepository systemSettingRepository,
      DeviceRepository deviceRepository,
      RackRepository rackRepository,
      RoomRepository roomRepository,
      InterventionRepository interventionRepository,
      AiInsightRepository aiInsightRepository,
      AuditLogWriter auditLogWriter) {
    this.systemSettingRepository = systemSettingRepository;
    this.deviceRepository = deviceRepository;
    this.rackRepository = rackRepository;
    this.roomRepository = roomRepository;
    this.interventionRepository = interventionRepository;
    this.aiInsightRepository = aiInsightRepository;
    this.auditLogWriter = auditLogWriter;
  }

  public boolean isAutonomousActionsEnabled() {
    return systemSettingRepository
        .findBySettingKeyIgnoreCase(AUTONOMOUS_ACTIONS_SETTING_KEY)
        .map(setting -> Boolean.parseBoolean(setting.getSettingValue()))
        .orElse(false);
  }

  public AiActionOutcome createUrgentIntervention(
      Long deviceId, String title, String description, String actorLabel, boolean forceApply) {
    boolean shouldApply = forceApply || isAutonomousActionsEnabled();
    Device device =
        deviceRepository
            .findById(deviceId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found."));

    if (!shouldApply) {
      AiInsight insight =
          logInsight(
              AiInsightType.RECOMMENDATION,
              AiInsightSeverity.CRITICAL,
              "DEVICE",
              device.getId(),
              device.getName(),
              title,
              description,
              "Create a CRITICAL intervention for device " + device.getName(),
              false,
              PENDING_CREATE_INTERVENTION);
      return AiActionOutcome.loggedAsRecommendation(
          insight.getId(),
          "Autonomous actions are disabled; logged as recommendation #"
              + insight.getId()
              + " for human review.");
    }

    Intervention intervention = new Intervention();
    intervention.setDevice(device);
    intervention.setTitle(title);
    intervention.setDescription(description);
    intervention.setInterventionType(InterventionType.INCIDENT_RESPONSE);
    intervention.setPriority(InterventionPriority.CRITICAL);
    intervention.setStatus(InterventionStatus.SCHEDULED);
    Instant now = Instant.now();
    intervention.setScheduledAt(now);
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    Intervention saved = interventionRepository.save(intervention);

    String actionDetails =
        "Created intervention #" + saved.getId() + " for device " + device.getName();
    AiInsight insight =
        logInsight(
            AiInsightType.AUTONOMOUS_ACTION,
            AiInsightSeverity.CRITICAL,
            "DEVICE",
            device.getId(),
            device.getName(),
            title,
            description,
            null,
            true,
            actionDetails);
    auditLogWriter.log(
        actorLabel, AuditAction.CREATE, "INTERVENTION", saved.getId().toString(), actionDetails);
    return AiActionOutcome.applied(insight.getId(), "Action executed: " + actionDetails);
  }

  public AiActionOutcome setEntityStatus(
      String entityType,
      Long entityId,
      String newStatus,
      String reason,
      String actorLabel,
      boolean forceApply) {
    boolean shouldApply = forceApply || isAutonomousActionsEnabled();
    String entityName = resolveEntityName(entityType, entityId);
    String title = "Set " + entityType + " " + entityName + " status to " + newStatus;

    if (!shouldApply) {
      AiInsight insight =
          logInsight(
              AiInsightType.RECOMMENDATION,
              AiInsightSeverity.CRITICAL,
              entityType,
              entityId,
              entityName,
              title,
              reason,
              title,
              false,
              PENDING_SET_STATUS_PREFIX + newStatus);
      return AiActionOutcome.loggedAsRecommendation(
          insight.getId(),
          "Autonomous actions are disabled; logged as recommendation #"
              + insight.getId()
              + " for human review.");
    }

    applyStatus(entityType, entityId, newStatus);
    String actionDetails = title + " (reason: " + reason + ")";
    AiInsight insight =
        logInsight(
            AiInsightType.AUTONOMOUS_ACTION,
            AiInsightSeverity.CRITICAL,
            entityType,
            entityId,
            entityName,
            title,
            reason,
            null,
            true,
            actionDetails);
    auditLogWriter.log(
        actorLabel, AuditAction.UPDATE, entityType, entityId.toString(), actionDetails);
    return AiActionOutcome.applied(insight.getId(), "Action executed: " + actionDetails);
  }

  private String resolveEntityName(String entityType, Long entityId) {
    return switch (entityType) {
      case "DEVICE" ->
          deviceRepository
              .findById(entityId)
              .map(Device::getName)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found."));
      case "RACK" ->
          rackRepository
              .findById(entityId)
              .map(Rack::getName)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rack not found."));
      case "ROOM" ->
          roomRepository
              .findById(entityId)
              .map(Room::getName)
              .orElseThrow(
                  () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found."));
      default ->
          throw new ResponseStatusException(
              HttpStatus.BAD_REQUEST, "Unknown entity type: " + entityType);
    };
  }

  private void applyStatus(String entityType, Long entityId, String newStatus) {
    Instant now = Instant.now();
    switch (entityType) {
      case "DEVICE" -> {
        Device device =
            deviceRepository
                .findById(entityId)
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found."));
        device.setStatus(DeviceStatus.valueOf(newStatus));
        device.setUpdatedAt(now);
        deviceRepository.save(device);
      }
      case "RACK" -> {
        Rack rack =
            rackRepository
                .findById(entityId)
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rack not found."));
        rack.setStatus(RackStatus.valueOf(newStatus));
        rack.setUpdatedAt(now);
        rackRepository.save(rack);
      }
      case "ROOM" -> {
        Room room =
            roomRepository
                .findById(entityId)
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found."));
        room.setStatus(RoomStatus.valueOf(newStatus));
        room.setUpdatedAt(now);
        roomRepository.save(room);
      }
      default ->
          throw new ResponseStatusException(
              HttpStatus.BAD_REQUEST, "Unknown entity type: " + entityType);
    }
  }

  private AiInsight logInsight(
      AiInsightType type,
      AiInsightSeverity severity,
      String entityType,
      Long entityId,
      String entityName,
      String title,
      String summary,
      String recommendedAction,
      boolean autonomousActionTaken,
      String actionDetails) {
    AiInsight insight = new AiInsight();
    insight.setInsightType(type);
    insight.setSource(AiInsightSource.CHAT_ASSISTANT);
    insight.setSeverity(severity);
    insight.setStatus(autonomousActionTaken ? AiInsightStatus.APPLIED : AiInsightStatus.NEW);
    insight.setEntityType(entityType);
    insight.setEntityId(entityId);
    insight.setEntityName(entityName);
    insight.setTitle(title);
    insight.setSummary(summary == null ? title : summary);
    insight.setRecommendedAction(recommendedAction);
    insight.setAutonomousActionTaken(autonomousActionTaken);
    insight.setActionDetails(actionDetails);
    insight.setDeleted(false);
    Instant now = Instant.now();
    insight.setCreatedAt(now);
    insight.setUpdatedAt(now);
    return aiInsightRepository.save(insight);
  }
}
