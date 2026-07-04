package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.NetworkRole;
import com.awb.backend.core.entity.NetworkRoleStatus;
import com.awb.backend.core.entity.NetworkRoleType;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.NetworkRoleRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo network fabric roles on top of existing demo switch/router devices, on first startup
 * (only if the table is empty). Looks devices up by serial number rather than assuming ids, so it
 * stays correct regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(5)
public class NetworkRoleSeeder implements CommandLineRunner {

  private final NetworkRoleRepository networkRoleRepository;
  private final DeviceRepository deviceRepository;

  public NetworkRoleSeeder(
      NetworkRoleRepository networkRoleRepository, DeviceRepository deviceRepository) {
    this.networkRoleRepository = networkRoleRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (networkRoleRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-RABAT-A1-1",
        "Spine Fabric Rabat 01",
        "NR-SPINE-RABAT-01",
        NetworkRoleType.SPINE,
        65001,
        "10.0.1.1",
        1);
    seed(
        "SN-RK-RABAT-A1-2",
        "Border Leaf Rabat 01",
        "NR-BL-RABAT-01",
        NetworkRoleType.BORDER_LEAF,
        65001,
        "10.0.1.2",
        1);
    seed(
        "SN-RK-RABAT-A2-2",
        "Leaf Rabat 02",
        "NR-LEAF-RABAT-02",
        NetworkRoleType.LEAF,
        65001,
        "10.0.1.3",
        1);
    seed(
        "SN-RK-CASA-A2-1",
        "Leaf Casablanca 01",
        "NR-LEAF-CASA-01",
        NetworkRoleType.LEAF,
        65002,
        "10.0.2.1",
        2);
    seed(
        "SN-RK-RAK-A2-2",
        "ToR Marrakech 01",
        "NR-TOR-RAK-01",
        NetworkRoleType.TOR_SWITCH,
        65003,
        "10.0.3.1",
        3);
  }

  private void seed(
      String deviceSerialNumber,
      String name,
      String code,
      NetworkRoleType roleType,
      int asn,
      String loopbackIp,
      int podNumber) {
    Device device = deviceRepository.findBySerialNumberIgnoreCase(deviceSerialNumber).orElse(null);
    if (device == null) {
      return;
    }

    NetworkRole role = new NetworkRole();
    role.setDevice(device);
    role.setName(name);
    role.setCode(code);
    role.setRoleType(roleType);
    role.setAsn(asn);
    role.setLoopbackIp(loopbackIp);
    role.setPodNumber(podNumber);
    role.setStatus(NetworkRoleStatus.ACTIVE);
    Instant now = Instant.now();
    role.setCreatedAt(now);
    role.setUpdatedAt(now);
    networkRoleRepository.save(role);
  }
}
