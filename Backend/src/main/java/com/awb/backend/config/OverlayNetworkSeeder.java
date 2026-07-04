package com.awb.backend.config;

import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.OverlayNetwork;
import com.awb.backend.core.entity.OverlayNetworkStatus;
import com.awb.backend.core.entity.OverlayType;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.OverlayNetworkRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds two demo VXLAN/EVPN overlay networks per existing demo datacenter on first startup (only if
 * the table is empty). Looks datacenters up by code rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(6)
public class OverlayNetworkSeeder implements CommandLineRunner {

  private final OverlayNetworkRepository overlayNetworkRepository;
  private final DatacenterRepository datacenterRepository;

  public OverlayNetworkSeeder(
      OverlayNetworkRepository overlayNetworkRepository,
      DatacenterRepository datacenterRepository) {
    this.overlayNetworkRepository = overlayNetworkRepository;
    this.datacenterRepository = datacenterRepository;
  }

  @Override
  public void run(String... args) {
    if (overlayNetworkRepository.count() > 0) {
      return;
    }

    seedFor(
        "DC-CASA-01",
        "65001",
        new Object[] {
          "Production Web Tier", "OV-CASA-L2-100", 10100, OverlayType.L2_EVPN, 100, null,
        },
        new Object[] {
          "Production Routed Overlay",
          "OV-CASA-L3-100",
          50100,
          OverlayType.L3_EVPN,
          null,
          "VRF-PROD",
        });
    seedFor(
        "DC-RABAT-01",
        "65001",
        new Object[] {
          "Core Fabric Segment", "OV-RABAT-L2-200", 10200, OverlayType.L2_EVPN, 200, null,
        },
        new Object[] {
          "Core Routed Overlay", "OV-RABAT-L3-200", 50200, OverlayType.L3_EVPN, null, "VRF-CORE",
        });
    seedFor(
        "DC-TNG-01",
        "65004",
        new Object[] {
          "Storage Segment", "OV-TNG-L2-300", 10300, OverlayType.L2_EVPN, 300, null,
        },
        new Object[] {
          "Storage Routed Overlay",
          "OV-TNG-L3-300",
          50300,
          OverlayType.L3_EVPN,
          null,
          "VRF-STORAGE",
        });
    seedFor(
        "DC-RAK-01",
        "65003",
        new Object[] {
          "Disaster Recovery Segment", "OV-RAK-L2-400", 10400, OverlayType.L2_EVPN, 400, null,
        },
        new Object[] {
          "Disaster Recovery Routed Overlay",
          "OV-RAK-L3-400",
          50400,
          OverlayType.L3_EVPN,
          null,
          "VRF-DR",
        });
  }

  private void seedFor(String datacenterCode, String asn, Object[] overlayA, Object[] overlayB) {
    Datacenter datacenter = datacenterRepository.findByCodeIgnoreCase(datacenterCode).orElse(null);
    if (datacenter == null) {
      return;
    }
    seed(datacenter, asn, overlayA);
    seed(datacenter, asn, overlayB);
  }

  private void seed(Datacenter datacenter, String asn, Object[] fields) {
    OverlayNetwork overlay = new OverlayNetwork();
    overlay.setDatacenter(datacenter);
    overlay.setName((String) fields[0]);
    overlay.setCode((String) fields[1]);
    overlay.setVni((Integer) fields[2]);
    overlay.setOverlayType((OverlayType) fields[3]);
    overlay.setVlanId((Integer) fields[4]);
    overlay.setVrfName((String) fields[5]);
    overlay.setRouteDistinguisher(asn + ":" + overlay.getVni());
    overlay.setRouteTargets(asn + ":" + overlay.getVni());
    overlay.setStatus(OverlayNetworkStatus.ACTIVE);
    Instant now = Instant.now();
    overlay.setCreatedAt(now);
    overlay.setUpdatedAt(now);
    overlayNetworkRepository.save(overlay);
  }
}
