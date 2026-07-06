package com.awb.backend.ai;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.ToolUnion;
import com.anthropic.models.messages.ToolUseBlock;
import com.awb.backend.core.entity.AiInsight;
import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightSource;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.repository.AiInsightRepository;
import com.awb.backend.core.repository.AnomalyDetectionRepository;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.SystemSettingRepository;
import com.awb.backend.core.repository.TelemetryConnectorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// Scheduled predictive-analysis job: builds a JSON snapshot of actually-existing relational
// signals (rack power headroom, stale telemetry connectors, long-open critical anomalies),
// sends one forced-tool-call request for structured findings, and writes AiInsight rows -
// invoking the same gated AiActionExecutor path as chat for auto-remediation candidates. This
// is honest LLM-reasoning-over-live-data (an AIOps pattern), not an invented time-series ML
// pipeline this schema has no data for.
@Component
public class AiPredictiveAnalysisJob {

  private static final Logger LOG = LoggerFactory.getLogger(AiPredictiveAnalysisJob.class);
  private static final double RACK_POWER_HEADROOM_THRESHOLD = 0.85;
  private static final long STALE_CONNECTOR_MULTIPLIER = 3L;
  private static final long LONG_OPEN_ANOMALY_HOURS = 24L;

  private static final String PREDICTIVE_SYSTEM_PROMPT =
      """
      You are an AIOps risk-analysis engine for AWB-NetTrace. You will be given a JSON \
      snapshot of current infrastructure state (rack power headroom, stale telemetry \
      connectors, long-open critical anomalies). Analyze it and report findings using \
      the report_predictive_findings tool only - do not respond with free text.

      For each finding, set shouldAutoRemediate=true only when the risk is CRITICAL or \
      HIGH and a concrete, low-ambiguity remediation exists. Prefer CREATE_INTERVENTION \
      over SET_STATUS_MAINTENANCE unless the situation is severe enough that a human \
      would reasonably want the entity taken out of service immediately.
      """;

  private final AnthropicGateway anthropicGateway;
  private final SystemSettingRepository systemSettingRepository;
  private final RackRepository rackRepository;
  private final TelemetryConnectorRepository telemetryConnectorRepository;
  private final AnomalyDetectionRepository anomalyDetectionRepository;
  private final AiInsightRepository aiInsightRepository;
  private final AiActionExecutor aiActionExecutor;
  private final ObjectMapper objectMapper;

  public AiPredictiveAnalysisJob(
      AnthropicGateway anthropicGateway,
      SystemSettingRepository systemSettingRepository,
      RackRepository rackRepository,
      TelemetryConnectorRepository telemetryConnectorRepository,
      AnomalyDetectionRepository anomalyDetectionRepository,
      AiInsightRepository aiInsightRepository,
      AiActionExecutor aiActionExecutor,
      ObjectMapper objectMapper) {
    this.anthropicGateway = anthropicGateway;
    this.systemSettingRepository = systemSettingRepository;
    this.rackRepository = rackRepository;
    this.telemetryConnectorRepository = telemetryConnectorRepository;
    this.anomalyDetectionRepository = anomalyDetectionRepository;
    this.aiInsightRepository = aiInsightRepository;
    this.aiActionExecutor = aiActionExecutor;
    this.objectMapper = objectMapper;
  }

  @Scheduled(fixedDelayString = "${ai.predictive-analysis.interval-ms:900000}")
  public void runScheduled() {
    run();
  }

  public int run() {
    if (!isPredictiveAnalysisEnabled()) {
      LOG.debug("Predictive analysis is disabled; skipping this run.");
      return 0;
    }
    if (!anthropicGateway.isConfigured()) {
      LOG.info("Predictive analysis skipped: Anthropic API key not configured.");
      return 0;
    }

    try {
      Map<String, Object> snapshot = buildSnapshot();
      String snapshotJson = objectMapper.writeValueAsString(snapshot);

      MessageCreateParams params =
          MessageCreateParams.builder()
              .model(anthropicGateway.model())
              .maxTokens(4096L)
              .system(PREDICTIVE_SYSTEM_PROMPT)
              .tools(List.of(ToolUnion.ofTool(AiToolDefinitions.reportPredictiveFindingsTool())))
              .toolToolChoice("report_predictive_findings")
              .addUserMessage(snapshotJson)
              .build();

      Message response = anthropicGateway.createMessage(params);
      Optional<ToolUseBlock> findingsBlock =
          response.content().stream().flatMap(block -> block.toolUse().stream()).findFirst();
      if (findingsBlock.isEmpty()) {
        LOG.warn("Predictive analysis: no findings tool call returned.");
        return 0;
      }

      return processFindings(findingsBlock.get()._input());
    } catch (Exception e) {
      LOG.error("Predictive analysis run failed", e);
      return 0;
    }
  }

  @SuppressWarnings("unchecked")
  private int processFindings(JsonValue input) {
    Optional<Map<String, JsonValue>> obj = input.asObject();
    if (obj.isEmpty()) {
      return 0;
    }
    JsonValue findingsValue = obj.get().get("findings");
    if (findingsValue == null) {
      return 0;
    }
    List<?> findings = findingsValue.convert(List.class);
    int created = 0;
    for (Object rawFinding : findings) {
      Map<String, Object> finding = (Map<String, Object>) rawFinding;
      created += processFinding(finding) ? 1 : 0;
    }
    return created;
  }

  private boolean processFinding(Map<String, Object> finding) {
    String entityType = (String) finding.get("entityType");
    String entityIdStr = (String) finding.get("entityId");
    String entityName = (String) finding.get("entityName");
    String severity = (String) finding.getOrDefault("severity", "INFO");
    String title = (String) finding.get("title");
    String summary = (String) finding.get("summary");
    String recommendedAction = (String) finding.get("recommendedAction");
    boolean shouldAutoRemediate = Boolean.TRUE.equals(finding.get("shouldAutoRemediate"));
    String remediationType = (String) finding.getOrDefault("remediationType", "NONE");

    if (title == null || summary == null) {
      return false;
    }

    if (shouldAutoRemediate
        && entityIdStr != null
        && "CREATE_INTERVENTION".equals(remediationType)) {
      aiActionExecutor.createUrgentIntervention(
          Long.valueOf(entityIdStr), title, summary, "ai-predictive-job", false);
      return true;
    }
    if (shouldAutoRemediate
        && entityIdStr != null
        && "SET_STATUS_MAINTENANCE".equals(remediationType)) {
      aiActionExecutor.setEntityStatus(
          entityType == null ? "DEVICE" : entityType,
          Long.valueOf(entityIdStr),
          "MAINTENANCE",
          summary,
          "ai-predictive-job",
          false);
      return true;
    }

    AiInsight insight = new AiInsight();
    insight.setInsightType(AiInsightType.RISK_PREDICTION);
    insight.setSource(AiInsightSource.SCHEDULED_JOB);
    insight.setSeverity(parseSeverity(severity));
    insight.setStatus(AiInsightStatus.NEW);
    insight.setEntityType(entityType);
    insight.setEntityId(entityIdStr == null ? null : Long.valueOf(entityIdStr));
    insight.setEntityName(entityName);
    insight.setTitle(title);
    insight.setSummary(summary);
    insight.setRecommendedAction(recommendedAction);
    insight.setAutonomousActionTaken(false);
    insight.setDeleted(false);
    Instant now = Instant.now();
    insight.setCreatedAt(now);
    insight.setUpdatedAt(now);
    aiInsightRepository.save(insight);
    return true;
  }

  private AiInsightSeverity parseSeverity(String severity) {
    try {
      return AiInsightSeverity.valueOf(severity);
    } catch (IllegalArgumentException e) {
      return AiInsightSeverity.INFO;
    }
  }

  private boolean isPredictiveAnalysisEnabled() {
    return systemSettingRepository
        .findBySettingKeyIgnoreCase("ai.predictive_analysis.enabled")
        .map(setting -> Boolean.parseBoolean(setting.getSettingValue()))
        .orElse(true);
  }

  private Map<String, Object> buildSnapshot() {
    Instant now = Instant.now();
    List<Map<String, Object>> racksNearCapacity =
        rackRepository.findAll().stream()
            .filter(r -> !r.isDeleted())
            .filter(r -> r.getPowerCapacityKw() != null && r.getPowerCapacityKw() > 0)
            .filter(r -> r.getCurrentPowerDrawKw() != null)
            .filter(
                r ->
                    r.getCurrentPowerDrawKw() / r.getPowerCapacityKw()
                        > RACK_POWER_HEADROOM_THRESHOLD)
            .map(
                r ->
                    Map.<String, Object>of(
                        "entityType", "RACK",
                        "entityId", r.getId().toString(),
                        "entityName", r.getName(),
                        "powerCapacityKw", r.getPowerCapacityKw(),
                        "currentPowerDrawKw", r.getCurrentPowerDrawKw()))
            .toList();

    List<Map<String, Object>> staleConnectors =
        telemetryConnectorRepository.findAll().stream()
            .filter(c -> !c.isDeleted())
            .filter(c -> c.getPollIntervalSeconds() != null)
            .filter(
                c ->
                    c.getLastPolledAt() == null
                        || c.getLastPolledAt()
                            .isBefore(
                                now.minusSeconds(
                                    c.getPollIntervalSeconds() * STALE_CONNECTOR_MULTIPLIER)))
            .map(
                c ->
                    Map.<String, Object>of(
                        "entityType", "DEVICE",
                        "entityId", c.getDevice().getId().toString(),
                        "entityName", c.getDevice().getName(),
                        "connectorName", c.getName(),
                        "lastPolledAt",
                            c.getLastPolledAt() == null ? "never" : c.getLastPolledAt().toString()))
            .toList();

    List<Map<String, Object>> longOpenCriticalAnomalies =
        anomalyDetectionRepository.findAll().stream()
            .filter(a -> !a.isDeleted() && a.getStatus() == AnomalyDetectionStatus.OPEN)
            .filter(
                a ->
                    a.getSeverity() == AnomalySeverity.CRITICAL
                        || a.getSeverity() == AnomalySeverity.HIGH)
            .filter(
                a ->
                    a.getDetectedAt()
                        .isBefore(now.minus(LONG_OPEN_ANOMALY_HOURS, ChronoUnit.HOURS)))
            .map(
                a ->
                    Map.<String, Object>of(
                        "entityType", "DEVICE",
                        "entityId", a.getDevice().getId().toString(),
                        "entityName", a.getDevice().getName(),
                        "anomalyTitle", a.getTitle(),
                        "severity", a.getSeverity().name(),
                        "detectedAt", a.getDetectedAt().toString()))
            .toList();

    return Map.of(
        "generatedAt", now.toString(),
        "racksNearCapacity", racksNearCapacity,
        "staleTelemetryConnectors", staleConnectors,
        "longOpenCriticalAnomalies", longOpenCriticalAnomalies);
  }
}
