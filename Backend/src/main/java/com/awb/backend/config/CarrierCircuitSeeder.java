package com.awb.backend.config;

import com.awb.backend.core.entity.CarrierCircuit;
import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.core.entity.CarrierCircuitType;
import com.awb.backend.core.entity.SdwanEdge;
import com.awb.backend.core.repository.CarrierCircuitRepository;
import com.awb.backend.core.repository.SdwanEdgeRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo carrier circuits feeding existing demo SD-WAN edges on first startup (only if the
 * table is empty). Looks edges up by code rather than assuming ids, so it stays correct regardless
 * of seeder execution order. Dev/demo data only.
 */
@Component
@Order(13)
public class CarrierCircuitSeeder implements CommandLineRunner {

  private final CarrierCircuitRepository carrierCircuitRepository;
  private final SdwanEdgeRepository sdwanEdgeRepository;

  public CarrierCircuitSeeder(
      CarrierCircuitRepository carrierCircuitRepository, SdwanEdgeRepository sdwanEdgeRepository) {
    this.carrierCircuitRepository = carrierCircuitRepository;
    this.sdwanEdgeRepository = sdwanEdgeRepository;
  }

  @Override
  public void run(String... args) {
    if (carrierCircuitRepository.count() > 0) {
      return;
    }

    seed(
        "SDW-CASA-01",
        "Circuit MPLS Casablanca",
        "CC-CASA-01",
        CarrierCircuitType.MPLS,
        "Maroc Telecom",
        1000);
    seed(
        "SDW-CASA-01",
        "Circuit Broadband Casablanca",
        "CC-CASA-02",
        CarrierCircuitType.BROADBAND,
        "Orange Maroc",
        500);
    seed("SDW-RABAT-01", "Circuit 5G Rabat", "CC-RABAT-01", CarrierCircuitType.LTE_5G, "inwi", 300);
    seed(
        "SDW-TNG-01",
        "Circuit Fibre Noire Tanger",
        "CC-TNG-01",
        CarrierCircuitType.DARK_FIBER,
        "Maroc Telecom",
        10000);
    seed(
        "SDW-RAK-01",
        "Circuit MPLS Marrakech",
        "CC-RAK-01",
        CarrierCircuitType.MPLS,
        "Orange Maroc",
        1000);
  }

  private void seed(
      String edgeCode,
      String name,
      String code,
      CarrierCircuitType circuitType,
      String provider,
      int bandwidthMbps) {
    SdwanEdge edge = sdwanEdgeRepository.findByCodeIgnoreCase(edgeCode).orElse(null);
    if (edge == null) {
      return;
    }

    CarrierCircuit circuit = new CarrierCircuit();
    circuit.setEdge(edge);
    circuit.setName(name);
    circuit.setCode(code);
    circuit.setCircuitType(circuitType);
    circuit.setProvider(provider);
    circuit.setBandwidthMbps(bandwidthMbps);
    circuit.setStatus(CarrierCircuitStatus.ACTIVE);
    Instant now = Instant.now();
    circuit.setCreatedAt(now);
    circuit.setUpdatedAt(now);
    carrierCircuitRepository.save(circuit);
  }
}
