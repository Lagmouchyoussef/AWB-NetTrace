package com.awb.backend.config;

import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.AuditLog;
import com.awb.backend.core.repository.AuditLogRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small demo audit trail on first startup (only if the table is empty). Dev/demo data only.
 */
@Component
@Order(25)
public class AuditLogSeeder implements CommandLineRunner {

  private final AuditLogRepository auditLogRepository;

  public AuditLogSeeder(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  @Override
  public void run(String... args) {
    if (auditLogRepository.count() > 0) {
      return;
    }

    seed(
        "super.admin",
        AuditAction.LOGIN,
        "Session",
        null,
        "Connexion réussie depuis la console Super Admin.",
        "10.0.0.12",
        1);
    seed(
        "dc.admin",
        AuditAction.CREATE,
        "Datacenter",
        "DC-CASA-01",
        "Création du datacenter Casablanca.",
        "10.0.0.15",
        48);
    seed(
        "network.engineer",
        AuditAction.UPDATE,
        "CarrierCircuit",
        "CC-CASA-01",
        "Mise à jour du point d'atterrissage du circuit opérateur.",
        "10.0.0.21",
        24);
    seed(
        "super.admin",
        AuditAction.CONFIG_CHANGE,
        "SystemSetting",
        "session.timeout_minutes",
        "Modification du délai d'expiration de session.",
        "10.0.0.12",
        6);
    seed(
        "auditor",
        AuditAction.EXPORT,
        "Report",
        "RPT-COMPLIANCE-01",
        "Export du rapport de conformité mensuel.",
        "10.0.0.30",
        2);
  }

  private void seed(
      String actorUsername,
      AuditAction action,
      String entityType,
      String entityReference,
      String description,
      String ipAddress,
      long hoursAgo) {
    AuditLog log = new AuditLog();
    log.setActorUsername(actorUsername);
    log.setAction(action);
    log.setEntityType(entityType);
    log.setEntityReference(entityReference);
    log.setDescription(description);
    log.setIpAddress(ipAddress);
    Instant now = Instant.now();
    log.setOccurredAt(now.minus(hoursAgo, ChronoUnit.HOURS));
    log.setCreatedAt(now);
    log.setUpdatedAt(now);
    auditLogRepository.save(log);
  }
}
