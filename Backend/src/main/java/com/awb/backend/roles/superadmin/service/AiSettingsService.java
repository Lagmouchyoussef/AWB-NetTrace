package com.awb.backend.roles.superadmin.service;

import com.awb.backend.ai.AnthropicGateway;
import com.awb.backend.core.dto.AiSettingsResponse;
import com.awb.backend.core.dto.AiSettingsUpdateRequest;
import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.SystemSetting;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.entity.SystemSettingDataType;
import com.awb.backend.core.repository.SystemSettingRepository;
import com.awb.backend.core.util.AuditLogWriter;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Thin wrapper over SystemSetting rows for exactly 3 AI toggles, exposed via a small dedicated
// endpoint rather than the generic System Settings CRUD UI.
@Service
public class AiSettingsService {

  public static final String ASSISTANT_ENABLED_KEY = "ai.assistant.enabled";
  public static final String PREDICTIVE_ANALYSIS_ENABLED_KEY = "ai.predictive_analysis.enabled";
  public static final String AUTONOMOUS_ACTIONS_ENABLED_KEY = "ai.autonomous_actions.enabled";

  private final SystemSettingRepository systemSettingRepository;
  private final AnthropicGateway anthropicGateway;
  private final AuditLogWriter auditLogWriter;

  public AiSettingsService(
      SystemSettingRepository systemSettingRepository,
      AnthropicGateway anthropicGateway,
      AuditLogWriter auditLogWriter) {
    this.systemSettingRepository = systemSettingRepository;
    this.anthropicGateway = anthropicGateway;
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public AiSettingsResponse get() {
    AiSettingsResponse response = new AiSettingsResponse();
    response.setAssistantEnabled(readBoolean(ASSISTANT_ENABLED_KEY, true));
    response.setPredictiveAnalysisEnabled(readBoolean(PREDICTIVE_ANALYSIS_ENABLED_KEY, true));
    response.setAutonomousActionsEnabled(readBoolean(AUTONOMOUS_ACTIONS_ENABLED_KEY, false));
    response.setApiKeyConfigured(anthropicGateway.isConfigured());
    return response;
  }

  @Transactional
  public AiSettingsResponse update(AiSettingsUpdateRequest request, String actorUsername) {
    if (request.getAssistantEnabled() != null) {
      writeBoolean(ASSISTANT_ENABLED_KEY, request.getAssistantEnabled());
    }
    if (request.getPredictiveAnalysisEnabled() != null) {
      writeBoolean(PREDICTIVE_ANALYSIS_ENABLED_KEY, request.getPredictiveAnalysisEnabled());
    }
    if (request.getAutonomousActionsEnabled() != null) {
      writeBoolean(AUTONOMOUS_ACTIONS_ENABLED_KEY, request.getAutonomousActionsEnabled());
    }
    auditLogWriter.log(actorUsername, AuditAction.CONFIG_CHANGE, "AI_SETTINGS", null, "Updated AI settings.");
    return get();
  }

  private boolean readBoolean(String key, boolean defaultValue) {
    return systemSettingRepository
        .findBySettingKeyIgnoreCase(key)
        .map(setting -> Boolean.parseBoolean(setting.getSettingValue()))
        .orElse(defaultValue);
  }

  private void writeBoolean(String key, boolean value) {
    SystemSetting setting = systemSettingRepository.findBySettingKeyIgnoreCase(key).orElseGet(SystemSetting::new);
    boolean isNew = setting.getId() == null;
    setting.setSettingKey(key);
    setting.setSettingValue(Boolean.toString(value));
    setting.setCategory(SystemSettingCategory.INTEGRATIONS);
    setting.setDataType(SystemSettingDataType.BOOLEAN);
    setting.setDescription("AI Operations toggle: " + key);
    Instant now = Instant.now();
    if (isNew) {
      setting.setCreatedAt(now);
    }
    setting.setUpdatedAt(now);
    systemSettingRepository.save(setting);
  }
}
