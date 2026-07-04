package com.awb.backend.config;

import com.awb.backend.core.entity.NetworkRole;
import com.awb.backend.core.entity.TopologyLink;
import com.awb.backend.core.entity.TopologyLinkStatus;
import com.awb.backend.core.entity.TopologyLinkType;
import com.awb.backend.core.repository.NetworkRoleRepository;
import com.awb.backend.core.repository.TopologyLinkRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo fabric topology links between existing demo network roles on first startup (only if
 * the table is empty). Looks roles up by code rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(7)
public class TopologyLinkSeeder implements CommandLineRunner {

  private final TopologyLinkRepository topologyLinkRepository;
  private final NetworkRoleRepository networkRoleRepository;

  public TopologyLinkSeeder(
      TopologyLinkRepository topologyLinkRepository, NetworkRoleRepository networkRoleRepository) {
    this.topologyLinkRepository = topologyLinkRepository;
    this.networkRoleRepository = networkRoleRepository;
  }

  @Override
  public void run(String... args) {
    if (topologyLinkRepository.count() > 0) {
      return;
    }

    seed(
        "NR-SPINE-RABAT-01",
        "NR-BL-RABAT-01",
        "Spine-BorderLeaf Rabat 01",
        "TL-RABAT-01",
        TopologyLinkType.FABRIC_UPLINK,
        100,
        TopologyLinkStatus.UP);
    seed(
        "NR-SPINE-RABAT-01",
        "NR-LEAF-RABAT-02",
        "Spine-Leaf Rabat 01",
        "TL-RABAT-02",
        TopologyLinkType.FABRIC_DOWNLINK,
        100,
        TopologyLinkStatus.UP);
    seed(
        "NR-SPINE-RABAT-01",
        "NR-LEAF-CASA-01",
        "Rabat-Casablanca Inter-Pod 01",
        "TL-INTERPOD-01",
        TopologyLinkType.INTER_POD,
        400,
        TopologyLinkStatus.UP);
    seed(
        "NR-SPINE-RABAT-01",
        "NR-TOR-RAK-01",
        "Rabat-Marrakech Inter-Pod 01",
        "TL-INTERPOD-02",
        TopologyLinkType.INTER_POD,
        400,
        TopologyLinkStatus.DEGRADED);
  }

  private void seed(
      String sourceRoleCode,
      String targetRoleCode,
      String name,
      String code,
      TopologyLinkType linkType,
      int speedGbps,
      TopologyLinkStatus status) {
    NetworkRole sourceRole =
        networkRoleRepository.findByCodeIgnoreCase(sourceRoleCode).orElse(null);
    NetworkRole targetRole =
        networkRoleRepository.findByCodeIgnoreCase(targetRoleCode).orElse(null);
    if (sourceRole == null || targetRole == null) {
      return;
    }

    TopologyLink link = new TopologyLink();
    link.setSourceRole(sourceRole);
    link.setTargetRole(targetRole);
    link.setName(name);
    link.setCode(code);
    link.setLinkType(linkType);
    link.setSpeedGbps(speedGbps);
    link.setStatus(status);
    Instant now = Instant.now();
    link.setCreatedAt(now);
    link.setUpdatedAt(now);
    topologyLinkRepository.save(link);
  }
}
