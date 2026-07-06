package com.awb.backend.config;

import com.awb.backend.core.entity.SystemSetting;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.entity.SystemSettingDataType;
import com.awb.backend.core.repository.SystemSettingRepository;
import com.awb.backend.roles.superadmin.service.AiSettingsService;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds the 3 AI Operations toggles on first startup. Idempotent per-key (not per-table, since
 * SystemSettingSeeder already populates the shared system_settings table before this runs) -
 * autonomous actions default to OFF, a hard safety requirement.
 */
@Component
@Order(27)
public class AiSettingsSeeder implements CommandLineRunner {

  private final SystemSettingRepository systemSettingRepository;

  public AiSettingsSeeder(SystemSettingRepository systemSettingRepository) {
    this.systemSettingRepository = systemSettingRepository;
  }

  @Override
  public void run(String... args) {
    if (systemSettingRepository.existsBySettingKeyIgnoreCase(AiSettingsService.ASSISTANT_ENABLED_KEY)) {
      return;
    }

    seed(AiSettingsService.ASSISTANT_ENABLED_KEY, "true", "Enables the AI chat assistant.");
    seed(
        AiSettingsService.PREDICTIVE_ANALYSIS_ENABLED_KEY,
        "true",
        "Enables the scheduled predictive risk-analysis job.");
    seed(
        AiSettingsService.AUTONOMOUS_ACTIONS_ENABLED_KEY,
        "false",
        "Allows the AI to autonomously apply remediation actions (off by default - safety "
            + "critical).");
  }

  private void seed(String settingKey, String settingValue, String description) {
    SystemSetting setting = new SystemSetting();
    setting.setSettingKey(settingKey);
    setting.setSettingValue(settingValue);
    setting.setCategory(SystemSettingCategory.INTEGRATIONS);
    setting.setDataType(SystemSettingDataType.BOOLEAN);
    setting.setDescription(description);
    Instant now = Instant.now();
    setting.setCreatedAt(now);
    setting.setUpdatedAt(now);
    systemSettingRepository.save(setting);
  }
}
