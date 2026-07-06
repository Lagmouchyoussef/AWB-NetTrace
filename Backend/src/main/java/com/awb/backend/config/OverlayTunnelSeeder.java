package com.awb.backend.config;

import com.awb.backend.core.entity.OverlayTunnel;
import com.awb.backend.core.entity.OverlayTunnelStatus;
import com.awb.backend.core.entity.OverlayTunnelType;
import com.awb.backend.core.entity.SdwanEdge;
import com.awb.backend.core.repository.OverlayTunnelRepository;
import com.awb.backend.core.repository.SdwanEdgeRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo SD-WAN overlay tunnels between existing demo edges on first startup (only if the table
 * is empty). Looks edges up by code rather than assuming ids, so it stays correct regardless of
 * seeder execution order. Dev/demo data only.
 */
@Component
@Order(12)
public class OverlayTunnelSeeder implements CommandLineRunner {

  private final OverlayTunnelRepository overlayTunnelRepository;
  private final SdwanEdgeRepository sdwanEdgeRepository;

  public OverlayTunnelSeeder(
      OverlayTunnelRepository overlayTunnelRepository, SdwanEdgeRepository sdwanEdgeRepository) {
    this.overlayTunnelRepository = overlayTunnelRepository;
    this.sdwanEdgeRepository = sdwanEdgeRepository;
  }

  @Override
  public void run(String... args) {
    if (overlayTunnelRepository.count() > 0) {
      return;
    }

    seed(
        "SDW-CASA-01",
        "SDW-RABAT-01",
        "Tunnel Casablanca-Rabat",
        "OT-01",
        OverlayTunnelType.IPSEC,
        500,
        OverlayTunnelStatus.UP);
    seed(
        "SDW-RABAT-01",
        "SDW-TNG-01",
        "Tunnel Rabat-Tanger",
        "OT-02",
        OverlayTunnelType.IPSEC,
        300,
        OverlayTunnelStatus.UP);
    seed(
        "SDW-CASA-01",
        "SDW-RAK-01",
        "Tunnel Casablanca-Marrakech",
        "OT-03",
        OverlayTunnelType.VXLAN,
        200,
        OverlayTunnelStatus.DEGRADED);
  }

  private void seed(
      String sourceEdgeCode,
      String targetEdgeCode,
      String name,
      String code,
      OverlayTunnelType tunnelType,
      int bandwidthMbps,
      OverlayTunnelStatus status) {
    SdwanEdge source = sdwanEdgeRepository.findByCodeIgnoreCase(sourceEdgeCode).orElse(null);
    SdwanEdge target = sdwanEdgeRepository.findByCodeIgnoreCase(targetEdgeCode).orElse(null);
    if (source == null || target == null) {
      return;
    }

    OverlayTunnel tunnel = new OverlayTunnel();
    tunnel.setSourceEdge(source);
    tunnel.setTargetEdge(target);
    tunnel.setName(name);
    tunnel.setCode(code);
    tunnel.setTunnelType(tunnelType);
    tunnel.setBandwidthMbps(bandwidthMbps);
    tunnel.setStatus(status);
    Instant now = Instant.now();
    tunnel.setCreatedAt(now);
    tunnel.setUpdatedAt(now);
    overlayTunnelRepository.save(tunnel);
  }
}
