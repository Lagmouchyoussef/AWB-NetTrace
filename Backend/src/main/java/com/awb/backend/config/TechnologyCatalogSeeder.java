package com.awb.backend.config;

import com.awb.backend.core.entity.TechnologyCatalogEntry;
import com.awb.backend.core.entity.TechnologyCatalogStatus;
import com.awb.backend.core.entity.TechnologyCategory;
import com.awb.backend.core.repository.TechnologyCatalogRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small demo network technology catalog on first startup (only if the table is empty).
 * Dev/demo data only.
 */
@Component
@Order(19)
public class TechnologyCatalogSeeder implements CommandLineRunner {

  private final TechnologyCatalogRepository technologyCatalogRepository;

  public TechnologyCatalogSeeder(TechnologyCatalogRepository technologyCatalogRepository) {
    this.technologyCatalogRepository = technologyCatalogRepository;
  }

  @Override
  public void run(String... args) {
    if (technologyCatalogRepository.count() > 0) {
      return;
    }

    seed(
        "EVPN-VXLAN",
        "TECH-01",
        TechnologyCategory.NETWORKING_PROTOCOL,
        "IETF RFC 8365",
        "N/A",
        "Fabric overlay standard pour les réseaux de datacenter modernes.",
        TechnologyCatalogStatus.ACTIVE);
    seed(
        "Zero Trust Network Access",
        "TECH-02",
        TechnologyCategory.SECURITY,
        "Palo Alto Networks",
        "N/A",
        "Modèle de sécurité basé sur la vérification continue plutôt que la confiance implicite.",
        TechnologyCatalogStatus.ACTIVE);
    seed(
        "Kubernetes",
        "TECH-03",
        TechnologyCategory.VIRTUALIZATION,
        "CNCF",
        "1.31",
        "Orchestration de conteneurs pour les charges applicatives cloud-native.",
        TechnologyCatalogStatus.ACTIVE);
    seed(
        "OpenTelemetry",
        "TECH-04",
        TechnologyCategory.MONITORING,
        "CNCF",
        "1.9",
        "Standard ouvert de télémétrie unifiée (traces, métriques, logs).",
        TechnologyCatalogStatus.EVALUATION);
    seed(
        "NVMe-oF",
        "TECH-05",
        TechnologyCategory.STORAGE,
        "NVM Express Inc.",
        "1.1",
        "Stockage NVMe accessible sur le réseau, faible latence pour charges IA/HPC.",
        TechnologyCatalogStatus.ACTIVE);
  }

  private void seed(
      String name,
      String code,
      TechnologyCategory category,
      String vendor,
      String version,
      String description,
      TechnologyCatalogStatus status) {
    TechnologyCatalogEntry entry = new TechnologyCatalogEntry();
    entry.setName(name);
    entry.setCode(code);
    entry.setCategory(category);
    entry.setVendor(vendor);
    entry.setVersion(version);
    entry.setDescription(description);
    entry.setStatus(status);
    Instant now = Instant.now();
    entry.setCreatedAt(now);
    entry.setUpdatedAt(now);
    technologyCatalogRepository.save(entry);
  }
}
