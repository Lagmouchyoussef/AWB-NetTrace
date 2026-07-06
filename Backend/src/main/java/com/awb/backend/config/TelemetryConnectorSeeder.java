package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.TelemetryConnector;
import com.awb.backend.core.entity.TelemetryConnectorStatus;
import com.awb.backend.core.entity.TelemetryProtocol;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.TelemetryConnectorRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo telemetry connectors monitoring existing demo devices on first startup (only if the
 * table is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(14)
public class TelemetryConnectorSeeder implements CommandLineRunner {

  private final TelemetryConnectorRepository telemetryConnectorRepository;
  private final DeviceRepository deviceRepository;

  public TelemetryConnectorSeeder(
      TelemetryConnectorRepository telemetryConnectorRepository,
      DeviceRepository deviceRepository) {
    this.telemetryConnectorRepository = telemetryConnectorRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (telemetryConnectorRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "Telemetry Serveur Web 01",
        "TC-CASA-01",
        TelemetryProtocol.PROMETHEUS_EXPORTER,
        30);
    seed(
        "SN-RK-CASA-B1-1",
        "Telemetry IA GPU 01",
        "TC-CASA-02",
        TelemetryProtocol.GNMI_STREAMING,
        null);
    seed(
        "SN-RK-RABAT-A1-1",
        "Telemetry Spine Rabat",
        "TC-RABAT-01",
        TelemetryProtocol.GNMI_STREAMING,
        null);
    seed("SN-RK-TNG-B1-1", "Telemetry PDU Tanger", "TC-TNG-01", TelemetryProtocol.SNMP_V2C, 60);
  }

  private void seed(
      String deviceSerial,
      String name,
      String code,
      TelemetryProtocol protocol,
      Integer pollIntervalSeconds) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    TelemetryConnector connector = new TelemetryConnector();
    connector.setDevice(device);
    connector.setName(name);
    connector.setCode(code);
    connector.setProtocol(protocol);
    connector.setPollIntervalSeconds(pollIntervalSeconds);
    connector.setStatus(TelemetryConnectorStatus.ACTIVE);
    connector.setLastPolledAt(Instant.now());
    Instant now = Instant.now();
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    telemetryConnectorRepository.save(connector);
  }
}
