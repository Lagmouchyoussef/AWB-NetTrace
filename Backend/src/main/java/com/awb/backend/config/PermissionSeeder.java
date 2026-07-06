package com.awb.backend.config;

import com.awb.backend.core.entity.Permission;
import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.core.repository.PermissionRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small permission catalog on first startup (only if the table is empty). Dev/demo data
 * only.
 */
@Component
@Order(20)
public class PermissionSeeder implements CommandLineRunner {

  private final PermissionRepository permissionRepository;

  public PermissionSeeder(PermissionRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  @Override
  public void run(String... args) {
    if (permissionRepository.count() > 0) {
      return;
    }

    seed(
        "infrastructure.manage",
        "Gérer l'infrastructure physique",
        PermissionModule.INFRASTRUCTURE,
        "Créer, modifier et supprimer les datacenters, salles, baies et équipements.");
    seed(
        "fabric.manage",
        "Gérer la fabric réseau",
        PermissionModule.FABRIC,
        "Créer, modifier et supprimer les rôles réseau, overlays et liens de topologie.");
    seed(
        "cabling.manage",
        "Gérer le câblage",
        PermissionModule.CABLING,
        "Créer, modifier et supprimer les câbles, connecteurs et traces de chemin.");
    seed(
        "sdwan.manage",
        "Gérer le SD-WAN",
        PermissionModule.SDWAN,
        "Créer, modifier et supprimer les edges, tunnels et circuits opérateurs.");
    seed(
        "telemetry.manage",
        "Gérer la télémétrie",
        PermissionModule.TELEMETRY,
        "Créer, modifier et supprimer les connecteurs de télémétrie et tableaux de bord.");
    seed(
        "library.manage",
        "Gérer la bibliothèque technique",
        PermissionModule.LIBRARY,
        "Créer, modifier et supprimer les types d'équipements et le catalogue technologique.");
    seed(
        "administration.manage",
        "Gérer l'administration",
        PermissionModule.ADMINISTRATION,
        "Gérer les utilisateurs, rôles, permissions et paramètres système.");
    seed(
        "integrations.manage",
        "Gérer les intégrations",
        PermissionModule.INTEGRATIONS,
        "Créer, modifier et supprimer les connecteurs d'intégration et suivis de dérive.");
    seed(
        "audit.view",
        "Consulter l'audit",
        PermissionModule.AUDIT,
        "Consulter le journal d'audit et de conformité.");
    seed(
        "reports.view",
        "Consulter les rapports",
        PermissionModule.REPORTS,
        "Consulter et exporter les rapports.");
  }

  private void seed(String code, String name, PermissionModule module, String description) {
    Permission permission = new Permission();
    permission.setCode(code);
    permission.setName(name);
    permission.setModule(module);
    permission.setDescription(description);
    permission.setCreatedAt(Instant.now());
    permissionRepository.save(permission);
  }
}
