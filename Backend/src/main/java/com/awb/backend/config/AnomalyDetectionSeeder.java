package com.awb.backend.config;

import com.awb.backend.core.entity.AnomalyDetection;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.entity.AnomalyType;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.AnomalyDetectionRepository;
import com.awb.backend.core.repository.DeviceRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo anomaly alerts on existing demo devices on first startup (only if the table is empty).
 * Looks devices up by serial number rather than assuming ids, so it stays correct regardless of
 * seeder execution order. Dev/demo data only.
 */
@Component
@Order(16)
public class AnomalyDetectionSeeder implements CommandLineRunner {

  private final AnomalyDetectionRepository anomalyDetectionRepository;
  private final DeviceRepository deviceRepository;

  public AnomalyDetectionSeeder(
      AnomalyDetectionRepository anomalyDetectionRepository, DeviceRepository deviceRepository) {
    this.anomalyDetectionRepository = anomalyDetectionRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (anomalyDetectionRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-B1-1",
        "Pic de température GPU inhabituel",
        "Charge IA soutenue au-delà du seuil de conception thermique.",
        AnomalyType.THRESHOLD_BREACH,
        AnomalySeverity.HIGH,
        AnomalyDetectionStatus.OPEN,
        2,
        -1);
    seed(
        "SN-RK-RABAT-A1-1",
        "Flapping détecté sur le lien fabric",
        "Le lien spine-leaf bascule de manière répétée depuis 10 minutes.",
        AnomalyType.FLAPPING_LINK,
        AnomalySeverity.CRITICAL,
        AnomalyDetectionStatus.ACKNOWLEDGED,
        5,
        -1);
    seed(
        "SN-RK-CASA-A1-1",
        "Dérive de configuration détectée",
        "La configuration active ne correspond plus à la configuration de référence.",
        AnomalyType.CONFIG_DRIFT,
        AnomalySeverity.MEDIUM,
        AnomalyDetectionStatus.RESOLVED,
        30,
        6);
    seed(
        "SN-RK-TNG-A1-1",
        "Pic de trafic anormal",
        "Volume de trafic sortant 5x supérieur à la moyenne journalière.",
        AnomalyType.TRAFFIC_SPIKE,
        AnomalySeverity.LOW,
        AnomalyDetectionStatus.FALSE_POSITIVE,
        50,
        49);
  }

  private void seed(
      String deviceSerial,
      String title,
      String description,
      AnomalyType anomalyType,
      AnomalySeverity severity,
      AnomalyDetectionStatus status,
      long detectedHoursAgo,
      long resolvedHoursAgo) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    AnomalyDetection anomaly = new AnomalyDetection();
    anomaly.setDevice(device);
    anomaly.setTitle(title);
    anomaly.setDescription(description);
    anomaly.setAnomalyType(anomalyType);
    anomaly.setSeverity(severity);
    anomaly.setStatus(status);
    Instant now = Instant.now();
    anomaly.setDetectedAt(now.minus(detectedHoursAgo, ChronoUnit.HOURS));
    if (resolvedHoursAgo >= 0) {
      anomaly.setResolvedAt(now.minus(resolvedHoursAgo, ChronoUnit.HOURS));
    }
    anomaly.setCreatedAt(now);
    anomaly.setUpdatedAt(now);
    anomalyDetectionRepository.save(anomaly);
  }
}
