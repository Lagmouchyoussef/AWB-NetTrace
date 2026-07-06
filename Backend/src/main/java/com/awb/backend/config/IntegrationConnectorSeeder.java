package com.awb.backend.config;

import com.awb.backend.core.entity.AutomationType;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.IntegrationConnector;
import com.awb.backend.core.entity.IntegrationConnectorStatus;
import com.awb.backend.core.entity.IntegrationProtocol;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.IntegrationConnectorRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo integration/automation connectors on existing demo devices on first startup (only if
 * the table is empty). Looks devices up by serial number rather than assuming ids, so it stays
 * correct regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(23)
public class IntegrationConnectorSeeder implements CommandLineRunner {

  private final IntegrationConnectorRepository integrationConnectorRepository;
  private final DeviceRepository deviceRepository;

  public IntegrationConnectorSeeder(
      IntegrationConnectorRepository integrationConnectorRepository,
      DeviceRepository deviceRepository) {
    this.integrationConnectorRepository = integrationConnectorRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (integrationConnectorRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "Sauvegarde config Serveur Web",
        "IC-CASA-01",
        IntegrationProtocol.NETCONF,
        AutomationType.CONFIG_BACKUP,
        IntegrationConnectorStatus.ACTIVE);
    seed(
        "SN-RK-RABAT-A1-1",
        "Provisioning Zero-Touch Spine",
        "IC-RABAT-01",
        IntegrationProtocol.GNMI,
        AutomationType.ZERO_TOUCH_PROVISIONING,
        IntegrationConnectorStatus.ACTIVE);
    seed(
        "SN-RK-TNG-A1-1",
        "Vérification conformité Switch",
        "IC-TNG-01",
        IntegrationProtocol.SNMP_V3,
        AutomationType.COMPLIANCE_CHECK,
        IntegrationConnectorStatus.PAUSED);
    seed(
        "SN-RK-CASA-B1-1",
        "Push config Nœud IA",
        "IC-CASA-02",
        IntegrationProtocol.RESTCONF,
        AutomationType.CONFIG_PUSH,
        IntegrationConnectorStatus.ERROR);
  }

  private void seed(
      String deviceSerial,
      String name,
      String code,
      IntegrationProtocol protocol,
      AutomationType automationType,
      IntegrationConnectorStatus status) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerial).orElse(null);
    if (device == null) {
      return;
    }

    IntegrationConnector connector = new IntegrationConnector();
    connector.setDevice(device);
    connector.setName(name);
    connector.setCode(code);
    connector.setProtocol(protocol);
    connector.setAutomationType(automationType);
    connector.setStatus(status);
    Instant now = Instant.now();
    connector.setLastSyncAt(now);
    connector.setCreatedAt(now);
    connector.setUpdatedAt(now);
    integrationConnectorRepository.save(connector);
  }
}
