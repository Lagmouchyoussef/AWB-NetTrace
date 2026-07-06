package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.DriftType;
import com.awb.backend.core.entity.SyncDrift;
import com.awb.backend.core.entity.SyncDriftStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.SyncDriftRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo configuration drift records on existing demo devices on first startup (only if the
 * table is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(24)
public class SyncDriftSeeder implements CommandLineRunner {

  private final SyncDriftRepository syncDriftRepository;
  private final DeviceRepository deviceRepository;

  public SyncDriftSeeder(
      SyncDriftRepository syncDriftRepository, DeviceRepository deviceRepository) {
    this.syncDriftRepository = syncDriftRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (syncDriftRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "Firmware non conforme à la baseline",
        "Version de firmware différente de la version approuvée par l'équipe sécurité.",
        DriftType.FIRMWARE_VERSION,
        DriftSeverity.MEDIUM,
        SyncDriftStatus.DETECTED,
        3,
        -1);
    seed(
        "SN-RK-RABAT-A1-1",
        "Modification ACL non autorisée",
        "Une règle ACL a été modifiée en dehors du processus de changement approuvé.",
        DriftType.UNAUTHORIZED_CHANGE,
        DriftSeverity.CRITICAL,
        SyncDriftStatus.ACKNOWLEDGED,
        6,
        -1);
    seed(
        "SN-RK-TNG-A1-1",
        "Changement de VLAN détecté",
        "Le port a été réaffecté à un autre VLAN sans ticket de changement associé.",
        DriftType.VLAN_CHANGE,
        DriftSeverity.HIGH,
        SyncDriftStatus.REMEDIATED,
        24,
        2);
    seed(
        "SN-RK-CASA-B1-1",
        "Écart de configuration mineur",
        "Paramètre de journalisation différent de la configuration de référence.",
        DriftType.CONFIG_MISMATCH,
        DriftSeverity.LOW,
        SyncDriftStatus.IGNORED,
        48,
        -1);
  }

  private void seed(
      String deviceSerial,
      String title,
      String description,
      DriftType driftType,
      DriftSeverity severity,
      SyncDriftStatus status,
      long detectedHoursAgo,
      long remediatedHoursAgo) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    SyncDrift drift = new SyncDrift();
    drift.setDevice(device);
    drift.setTitle(title);
    drift.setDescription(description);
    drift.setDriftType(driftType);
    drift.setSeverity(severity);
    drift.setStatus(status);
    Instant now = Instant.now();
    drift.setDetectedAt(now.minus(detectedHoursAgo, ChronoUnit.HOURS));
    if (remediatedHoursAgo >= 0) {
      drift.setRemediatedAt(now.minus(remediatedHoursAgo, ChronoUnit.HOURS));
    }
    drift.setCreatedAt(now);
    drift.setUpdatedAt(now);
    syncDriftRepository.save(drift);
  }
}
