package com.awb.backend.config;

import com.awb.backend.core.entity.RealTimeDashboard;
import com.awb.backend.core.entity.RealTimeDashboardStatus;
import com.awb.backend.core.repository.RealTimeDashboardRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo real-time dashboard definitions on first startup (only if the table is empty).
 * Dev/demo data only.
 */
@Component
@Order(15)
public class RealTimeDashboardSeeder implements CommandLineRunner {

  private final RealTimeDashboardRepository realTimeDashboardRepository;

  public RealTimeDashboardSeeder(RealTimeDashboardRepository realTimeDashboardRepository) {
    this.realTimeDashboardRepository = realTimeDashboardRepository;
  }

  @Override
  public void run(String... args) {
    if (realTimeDashboardRepository.count() > 0) {
      return;
    }

    seed(
        "Vue d'ensemble Datacenters",
        "RTD-01",
        "Disponibilité, capacité et puissance de tous les datacenters",
        10,
        8);
    seed(
        "Supervision Fabric & Réseau",
        "RTD-02",
        "État des liens fabric, tunnels overlay et circuits opérateurs",
        15,
        6);
    seed(
        "Capacité Énergie & Refroidissement",
        "RTD-03",
        "Consommation énergétique et efficacité de refroidissement par salle",
        30,
        5);
    seed(
        "Sécurité & Conformité",
        "RTD-04",
        "Dérives de configuration et alertes de conformité",
        60,
        4);
  }

  private void seed(
      String name, String code, String description, int refreshIntervalSeconds, int widgetCount) {
    RealTimeDashboard dashboard = new RealTimeDashboard();
    dashboard.setName(name);
    dashboard.setCode(code);
    dashboard.setDescription(description);
    dashboard.setRefreshIntervalSeconds(refreshIntervalSeconds);
    dashboard.setWidgetCount(widgetCount);
    dashboard.setStatus(RealTimeDashboardStatus.ACTIVE);
    Instant now = Instant.now();
    dashboard.setCreatedAt(now);
    dashboard.setUpdatedAt(now);
    realTimeDashboardRepository.save(dashboard);
  }
}
