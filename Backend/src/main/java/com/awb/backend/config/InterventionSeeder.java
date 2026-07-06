package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo maintenance/incident tickets on existing demo devices on first startup (only if the
 * table is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(17)
public class InterventionSeeder implements CommandLineRunner {

  private final InterventionRepository interventionRepository;
  private final DeviceRepository deviceRepository;

  public InterventionSeeder(
      InterventionRepository interventionRepository, DeviceRepository deviceRepository) {
    this.interventionRepository = interventionRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (interventionRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "Maintenance préventive trimestrielle",
        "Contrôle des ventilateurs et mise à jour du firmware.",
        InterventionType.PREVENTIVE_MAINTENANCE,
        InterventionPriority.MEDIUM,
        InterventionStatus.SCHEDULED,
        "Ahmed Bennani",
        -48,
        Long.MIN_VALUE);
    seed(
        "SN-RK-CASA-B1-1",
        "Remplacement carte GPU défectueuse",
        "Erreurs ECC répétées détectées sur le nœud IA.",
        InterventionType.CORRECTIVE_MAINTENANCE,
        InterventionPriority.CRITICAL,
        InterventionStatus.IN_PROGRESS,
        "Sara El Amrani",
        -4,
        Long.MIN_VALUE);
    seed(
        "SN-RK-RABAT-A1-1",
        "Installation nouveau module d'extension",
        "Ajout d'un module 100G sur le switch spine.",
        InterventionType.INSTALLATION,
        InterventionPriority.LOW,
        InterventionStatus.COMPLETED,
        "Youssef Idrissi",
        -240,
        -230);
    seed(
        "SN-RK-TNG-A1-1",
        "Inspection annuelle infrastructure",
        "Audit complet de la baie et des connexions.",
        InterventionType.INSPECTION,
        InterventionPriority.LOW,
        InterventionStatus.CANCELLED,
        "Nadia Chraibi",
        -72,
        Long.MIN_VALUE);
  }

  private void seed(
      String deviceSerial,
      String title,
      String description,
      InterventionType interventionType,
      InterventionPriority priority,
      InterventionStatus status,
      String assignedTechnician,
      long scheduledHoursOffset,
      long completedHoursOffset) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    Intervention intervention = new Intervention();
    intervention.setDevice(device);
    intervention.setTitle(title);
    intervention.setDescription(description);
    intervention.setInterventionType(interventionType);
    intervention.setPriority(priority);
    intervention.setStatus(status);
    intervention.setAssignedTechnician(assignedTechnician);
    Instant now = Instant.now();
    intervention.setScheduledAt(now.plus(scheduledHoursOffset, ChronoUnit.HOURS));
    if (completedHoursOffset != Long.MIN_VALUE) {
      intervention.setCompletedAt(now.plus(completedHoursOffset, ChronoUnit.HOURS));
    }
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    interventionRepository.save(intervention);
  }
}
