package com.awb.backend.config;

import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.SdwanEdge;
import com.awb.backend.core.entity.SdwanEdgeStatus;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.SdwanEdgeRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds one demo SD-WAN edge per existing demo datacenter on first startup (only if the table is
 * empty). Looks datacenters up by code rather than assuming ids, so it stays correct regardless of
 * seeder execution order. Dev/demo data only.
 */
@Component
@Order(11)
public class SdwanEdgeSeeder implements CommandLineRunner {

  private final SdwanEdgeRepository sdwanEdgeRepository;
  private final DatacenterRepository datacenterRepository;

  public SdwanEdgeSeeder(
      SdwanEdgeRepository sdwanEdgeRepository, DatacenterRepository datacenterRepository) {
    this.sdwanEdgeRepository = sdwanEdgeRepository;
    this.datacenterRepository = datacenterRepository;
  }

  @Override
  public void run(String... args) {
    if (sdwanEdgeRepository.count() > 0) {
      return;
    }

    seed("DC-CASA-01", "Edge SD-WAN Casablanca", "SDW-CASA-01", "Cisco Viptela", "vEdge 2000", 2);
    seed("DC-RABAT-01", "Edge SD-WAN Rabat", "SDW-RABAT-01", "VMware VeloCloud", "Edge 840", 2);
    seed("DC-TNG-01", "Edge SD-WAN Tanger", "SDW-TNG-01", "Fortinet", "FortiGate 100F", 1);
    seed(
        "DC-RAK-01",
        "Edge SD-WAN Marrakech",
        "SDW-RAK-01",
        "Palo Alto Networks",
        "Prisma SD-WAN ION 3000",
        2);
  }

  private void seed(
      String datacenterCode,
      String name,
      String code,
      String vendor,
      String model,
      int wanLinkCount) {
    Datacenter datacenter = datacenterRepository.findByCodeIgnoreCase(datacenterCode).orElse(null);
    if (datacenter == null) {
      return;
    }

    SdwanEdge edge = new SdwanEdge();
    edge.setDatacenter(datacenter);
    edge.setName(name);
    edge.setCode(code);
    edge.setVendor(vendor);
    edge.setModel(model);
    edge.setWanLinkCount(wanLinkCount);
    edge.setStatus(SdwanEdgeStatus.ACTIVE);
    Instant now = Instant.now();
    edge.setCreatedAt(now);
    edge.setUpdatedAt(now);
    sdwanEdgeRepository.save(edge);
  }
}
