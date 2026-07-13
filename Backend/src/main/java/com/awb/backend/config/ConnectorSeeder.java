package com.awb.backend.config;

import com.awb.backend.core.entity.Connector;
import com.awb.backend.core.entity.ConnectorFormFactor;
import com.awb.backend.core.entity.ConnectorStatus;
import com.awb.backend.core.entity.ConnectorType;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.ConnectorRepository;
import com.awb.backend.core.repository.DeviceRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo transceivers/connectors installed in existing demo devices on first startup (only if
 * the table is empty). Looks devices up by serial number rather than assuming ids, so it stays
 * correct regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(8)
public class ConnectorSeeder implements CommandLineRunner {

  private final ConnectorRepository connectorRepository;
  private final DeviceRepository deviceRepository;

  public ConnectorSeeder(
      ConnectorRepository connectorRepository, DeviceRepository deviceRepository) {
    this.connectorRepository = connectorRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (connectorRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-B1-1",
        "Transceiver GPU 01",
        "CN-CASA-01",
        ConnectorFormFactor.QSFP_DD,
        ConnectorType.MPO_MTP,
        400,
        850);
    seed(
        "SN-RK-CASA-A2-1",
        "Transceiver Switch Casablanca",
        "CN-CASA-02",
        ConnectorFormFactor.QSFP28,
        ConnectorType.LC,
        100,
        1310);
    seed(
        "SN-RK-RABAT-A1-1",
        "Transceiver Spine Rabat",
        "CN-RABAT-01",
        ConnectorFormFactor.QSFP28,
        ConnectorType.LC,
        100,
        1310);
    seed(
        "SN-RK-TNG-A1-1",
        "Transceiver Stockage Tanger",
        "CN-TNG-01",
        ConnectorFormFactor.SFP28,
        ConnectorType.LC,
        25,
        850);

    // Additional spare-side connectors so every seeded cable in CableSeeder can demonstrate a
    // genuine port-to-port link (both endpoints need a connector on their respective device).
    seed(
        "SN-RK-CASA-A1-1",
        "Transceiver Serveur Web Casablanca",
        "CN-CASA-03",
        ConnectorFormFactor.QSFP28,
        ConnectorType.LC,
        100,
        1310);
    seed(
        "SN-RK-CASA-B1-2",
        "Transceiver GPU 02",
        "CN-CASA-04",
        ConnectorFormFactor.QSFP_DD,
        ConnectorType.MPO_MTP,
        400,
        850);
    seed(
        "SN-RK-RABAT-A1-2",
        "Transceiver Routeur Bordure Rabat",
        "CN-RABAT-02",
        ConnectorFormFactor.QSFP28,
        ConnectorType.LC,
        100,
        1310);
    seed(
        "SN-RK-TNG-A1-2",
        "Transceiver Stockage Tanger 02",
        "CN-TNG-02",
        ConnectorFormFactor.SFP28,
        ConnectorType.LC,
        25,
        850);
  }

  private void seed(
      String deviceSerial,
      String name,
      String code,
      ConnectorFormFactor formFactor,
      ConnectorType connectorType,
      int speedGbps,
      int wavelengthNm) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    Connector connector = new Connector();
    connector.setDevice(device);
    connector.setName(name);
    connector.setCode(code);
    connector.setFormFactor(formFactor);
    connector.setConnectorType(connectorType);
    connector.setSpeedGbps(speedGbps);
    connector.setWavelengthNm(wavelengthNm);
    connector.setStatus(ConnectorStatus.ACTIVE);
    Instant now = Instant.now();
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    connectorRepository.save(connector);
  }
}
