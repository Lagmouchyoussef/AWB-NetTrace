package com.awb.backend.config;

import com.awb.backend.core.entity.CarrierCircuit;
import com.awb.backend.core.entity.CarrierCircuitStatus;
import com.awb.backend.core.entity.CarrierCircuitType;
import com.awb.backend.core.entity.Connector;
import com.awb.backend.core.repository.CarrierCircuitRepository;
import com.awb.backend.core.repository.ConnectorRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo carrier circuits (physical meet-me-room landing points for external circuits) on
 * first startup (only if the table is empty). Looks connectors up by code rather than assuming
 * ids, so it stays correct regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(13)
public class CarrierCircuitSeeder implements CommandLineRunner {

  private final CarrierCircuitRepository carrierCircuitRepository;
  private final ConnectorRepository connectorRepository;

  public CarrierCircuitSeeder(
      CarrierCircuitRepository carrierCircuitRepository, ConnectorRepository connectorRepository) {
    this.carrierCircuitRepository = carrierCircuitRepository;
    this.connectorRepository = connectorRepository;
  }

  @Override
  public void run(String... args) {
    if (carrierCircuitRepository.count() > 0) {
      return;
    }

    seed(
        "Circuit MPLS Casablanca",
        "CC-CASA-01",
        CarrierCircuitType.MPLS,
        "Maroc Telecom",
        "CN-CASA-01");
    seed(
        "Circuit Broadband Casablanca",
        "CC-CASA-02",
        CarrierCircuitType.BROADBAND,
        "Orange Maroc",
        "CN-CASA-02");
    seed("Circuit 5G Rabat", "CC-RABAT-01", CarrierCircuitType.LTE_5G, "inwi", "CN-RABAT-01");
    seed(
        "Circuit Fibre Noire Tanger",
        "CC-TNG-01",
        CarrierCircuitType.DARK_FIBER,
        "Maroc Telecom",
        "CN-TNG-01");
    // No demo connector exists for Marrakech yet - landing point left unassigned.
    seed("Circuit MPLS Marrakech", "CC-RAK-01", CarrierCircuitType.MPLS, "Orange Maroc", null);
  }

  private void seed(
      String name,
      String code,
      CarrierCircuitType circuitType,
      String provider,
      String connectorCode) {
    Connector connector =
        connectorCode == null
            ? null
            : connectorRepository.findAll().stream()
                .filter(c -> c.getCode().equalsIgnoreCase(connectorCode))
                .findFirst()
                .orElse(null);

    CarrierCircuit circuit = new CarrierCircuit();
    circuit.setName(name);
    circuit.setCode(code);
    circuit.setCircuitType(circuitType);
    circuit.setProvider(provider);
    circuit.setTerminatesAtConnector(connector);
    circuit.setStatus(CarrierCircuitStatus.ACTIVE);
    Instant now = Instant.now();
    circuit.setCreatedAt(now);
    circuit.setUpdatedAt(now);
    carrierCircuitRepository.save(circuit);
  }
}
