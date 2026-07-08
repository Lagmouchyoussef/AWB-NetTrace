package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.InterventionType;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.UserRepository;
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
  private final UserRepository userRepository;

  public InterventionSeeder(
      InterventionRepository interventionRepository,
      DeviceRepository deviceRepository,
      UserRepository userRepository) {
    this.interventionRepository = interventionRepository;
    this.deviceRepository = deviceRepository;
    this.userRepository = userRepository;
  }

  @Override
  public void run(String... args) {
    if (interventionRepository.count() > 0) {
      return;
    }
    User technician = userRepository.findByUsername("technician").orElse(null);

    seed(
        new SeedSpec(
            "SN-RK-CASA-A1-1",
            "Maintenance préventive trimestrielle",
            "Contrôle des ventilateurs et mise à jour du firmware.",
            InterventionType.PREVENTIVE_MAINTENANCE,
            InterventionPriority.MEDIUM,
            InterventionStatus.SCHEDULED,
            -48,
            Long.MIN_VALUE),
        technician);
    seed(
        new SeedSpec(
            "SN-RK-CASA-B1-1",
            "Remplacement carte GPU défectueuse",
            "Erreurs ECC répétées détectées sur le nœud IA.",
            InterventionType.CORRECTIVE_MAINTENANCE,
            InterventionPriority.CRITICAL,
            InterventionStatus.IN_PROGRESS,
            -4,
            Long.MIN_VALUE),
        technician);
    seed(
        new SeedSpec(
            "SN-RK-RABAT-A1-1",
            "Installation nouveau module d'extension",
            "Ajout d'un module 100G sur le switch spine.",
            InterventionType.INSTALLATION,
            InterventionPriority.LOW,
            InterventionStatus.COMPLETED,
            -240,
            -230),
        technician);
    seed(
        new SeedSpec(
            "SN-RK-TNG-A1-1",
            "Inspection annuelle infrastructure",
            "Audit complet de la baie et des connexions.",
            InterventionType.INSPECTION,
            InterventionPriority.LOW,
            InterventionStatus.CANCELLED,
            -72,
            Long.MIN_VALUE),
        technician);
  }

  private record SeedSpec(
      String deviceSerial,
      String title,
      String description,
      InterventionType interventionType,
      InterventionPriority priority,
      InterventionStatus status,
      long scheduledHoursOffset,
      long completedHoursOffset) {}

  private void seed(SeedSpec spec, User technician) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(spec.deviceSerial()).orElse(null);
    if (device == null) {
      return;
    }

    Intervention intervention = new Intervention();
    intervention.setDevice(device);
    intervention.setTitle(spec.title());
    intervention.setDescription(spec.description());
    intervention.setInterventionType(spec.interventionType());
    intervention.setPriority(spec.priority());
    intervention.setStatus(spec.status());
    intervention.setAssignedTechnician(technician);
    Instant now = Instant.now();
    intervention.setScheduledAt(now.plus(spec.scheduledHoursOffset(), ChronoUnit.HOURS));
    if (spec.completedHoursOffset() != Long.MIN_VALUE) {
      intervention.setCompletedAt(now.plus(spec.completedHoursOffset(), ChronoUnit.HOURS));
    }
    intervention.setCreatedAt(now);
    intervention.setUpdatedAt(now);
    interventionRepository.save(intervention);
  }
}
