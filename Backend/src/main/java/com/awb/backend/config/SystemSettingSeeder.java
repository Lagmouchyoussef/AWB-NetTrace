package com.awb.backend.config;

import com.awb.backend.core.entity.SystemSetting;
import com.awb.backend.core.entity.SystemSettingCategory;
import com.awb.backend.core.entity.SystemSettingDataType;
import com.awb.backend.core.repository.SystemSettingRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small set of demo system settings on first startup (only if the table is empty). Dev/demo
 * data only.
 */
@Component
@Order(22)
public class SystemSettingSeeder implements CommandLineRunner {

  private final SystemSettingRepository systemSettingRepository;

  public SystemSettingSeeder(SystemSettingRepository systemSettingRepository) {
    this.systemSettingRepository = systemSettingRepository;
  }

  @Override
  public void run(String... args) {
    if (systemSettingRepository.count() > 0) {
      return;
    }

    seed(
        "session.timeout_minutes",
        "30",
        SystemSettingCategory.SECURITY,
        SystemSettingDataType.NUMBER,
        "Durée d'inactivité avant déconnexion automatique.");
    seed(
        "password.min_length",
        "12",
        SystemSettingCategory.SECURITY,
        SystemSettingDataType.NUMBER,
        "Longueur minimale requise pour les mots de passe.");
    seed(
        "notifications.email_enabled",
        "true",
        SystemSettingCategory.NOTIFICATIONS,
        SystemSettingDataType.BOOLEAN,
        "Active l'envoi de notifications par courriel.");
    seed(
        "platform.default_language",
        "fr",
        SystemSettingCategory.GENERAL,
        SystemSettingDataType.STRING,
        "Langue par défaut de la plateforme pour les nouveaux utilisateurs.");
    seed(
        "monitoring.retention_days",
        "90",
        SystemSettingCategory.MONITORING,
        SystemSettingDataType.NUMBER,
        "Durée de rétention des données de télémétrie et journaux.");
  }

  private void seed(
      String settingKey,
      String settingValue,
      SystemSettingCategory category,
      SystemSettingDataType dataType,
      String description) {
    SystemSetting setting = new SystemSetting();
    setting.setSettingKey(settingKey);
    setting.setSettingValue(settingValue);
    setting.setCategory(category);
    setting.setDataType(dataType);
    setting.setDescription(description);
    Instant now = Instant.now();
    setting.setCreatedAt(now);
    setting.setUpdatedAt(now);
    systemSettingRepository.save(setting);
  }
}
