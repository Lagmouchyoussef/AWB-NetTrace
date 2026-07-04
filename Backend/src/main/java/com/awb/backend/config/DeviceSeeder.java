package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.core.entity.DeviceType;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.RackRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds two demo devices per existing demo rack on first startup (only if the table is empty).
 * Looks racks up by code rather than assuming ids, so it stays correct regardless of seeder
 * execution order. Dev/demo data only.
 */
@Component
@Order(4)
public class DeviceSeeder implements CommandLineRunner {

  private final DeviceRepository deviceRepository;
  private final RackRepository rackRepository;

  public DeviceSeeder(DeviceRepository deviceRepository, RackRepository rackRepository) {
    this.deviceRepository = deviceRepository;
    this.rackRepository = rackRepository;
  }

  @Override
  public void run(String... args) {
    if (deviceRepository.count() > 0) {
      return;
    }

    seedFor(
        "RK-CASA-A1",
        new Object[] {
          "Serveur Web 01",
          DeviceType.SERVER,
          "Dell",
          "PowerEdge R750",
          1,
          2,
          450.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Serveur Web 02",
          DeviceType.SERVER,
          "Dell",
          "PowerEdge R750",
          3,
          2,
          450.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-CASA-A2",
        new Object[] {
          "Switch Access 01",
          DeviceType.SWITCH,
          "Cisco",
          "Catalyst 9300",
          1,
          1,
          150.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Firewall Périmètre",
          DeviceType.FIREWALL,
          "Fortinet",
          "FortiGate 200F",
          2,
          1,
          120.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-CASA-B1",
        new Object[] {
          "Nœud IA GPU 01",
          DeviceType.GPU_AI_NODE,
          "NVIDIA",
          "DGX H100",
          1,
          8,
          10200.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Nœud IA GPU 02",
          DeviceType.GPU_AI_NODE,
          "NVIDIA",
          "DGX H100",
          9,
          8,
          10200.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-CASA-B2",
        new Object[] {
          "Nœud IA GPU 03",
          DeviceType.GPU_AI_NODE,
          "NVIDIA",
          "DGX H100",
          1,
          8,
          10200.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Nœud IA GPU 04",
          DeviceType.GPU_AI_NODE,
          "NVIDIA",
          "DGX H100",
          9,
          8,
          10200.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RABAT-A1",
        new Object[] {
          "Switch Core 01",
          DeviceType.SWITCH,
          "Cisco",
          "Nexus 9500",
          1,
          2,
          400.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Routeur Bordure 01",
          DeviceType.ROUTER,
          "Juniper",
          "MX304",
          3,
          2,
          350.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RABAT-A2",
        new Object[] {
          "Répartiteur Charge 01",
          DeviceType.LOAD_BALANCER,
          "F5",
          "BIG-IP i5800",
          1,
          2,
          300.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Switch Access 02",
          DeviceType.SWITCH,
          "Cisco",
          "Catalyst 9300",
          3,
          1,
          150.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RABAT-B1",
        new Object[] {
          "Onduleur Principal",
          DeviceType.UPS,
          "APC",
          "Symmetra PX",
          1,
          6,
          null,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "PDU Rack B1", DeviceType.PDU, "APC", "AP8853", 7, 1, null, DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RABAT-B2",
        new Object[] {
          "Onduleur Secours", DeviceType.UPS, "APC", "Symmetra PX", 1, 6, null, DeviceStatus.SPARE,
        },
        null);
    seedFor(
        "RK-TNG-A1",
        new Object[] {
          "Baie Stockage 01",
          DeviceType.STORAGE_ARRAY,
          "NetApp",
          "AFF A400",
          1,
          4,
          800.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Baie Stockage 02",
          DeviceType.STORAGE_ARRAY,
          "NetApp",
          "AFF A400",
          5,
          4,
          800.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-TNG-A2",
        new Object[] {
          "Baie Stockage 03",
          DeviceType.STORAGE_ARRAY,
          "NetApp",
          "AFF A400",
          1,
          4,
          800.0,
          DeviceStatus.MAINTENANCE,
        },
        null);
    seedFor(
        "RK-TNG-B1",
        new Object[] {
          "PDU Rack B1", DeviceType.PDU, "APC", "AP8853", 1, 1, null, DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Unité Climatisation 01",
          DeviceType.COOLING_UNIT,
          "Vertiv",
          "Liebert CRV",
          2,
          4,
          2500.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-TNG-B2",
        new Object[] {
          "Unité Climatisation 02",
          DeviceType.COOLING_UNIT,
          "Vertiv",
          "Liebert CRV",
          1,
          4,
          2500.0,
          DeviceStatus.ACTIVE,
        },
        null);
    seedFor(
        "RK-RAK-A1",
        new Object[] {
          "Serveur App 01",
          DeviceType.SERVER,
          "HPE",
          "ProLiant DL380",
          1,
          2,
          400.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Serveur App 02",
          DeviceType.SERVER,
          "HPE",
          "ProLiant DL380",
          3,
          2,
          400.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RAK-A2",
        new Object[] {
          "Serveur App 03",
          DeviceType.SERVER,
          "HPE",
          "ProLiant DL380",
          1,
          2,
          400.0,
          DeviceStatus.ACTIVE,
        },
        new Object[] {
          "Switch Access 03",
          DeviceType.SWITCH,
          "Cisco",
          "Catalyst 9300",
          3,
          1,
          150.0,
          DeviceStatus.ACTIVE,
        });
    seedFor(
        "RK-RAK-B1",
        new Object[] {
          "Unité Climatisation 03",
          DeviceType.COOLING_UNIT,
          "Vertiv",
          "Liebert CRV",
          1,
          4,
          2500.0,
          DeviceStatus.ACTIVE,
        },
        null);
    seedFor(
        "RK-RAK-B2",
        new Object[] {
          "Équipement Retiré",
          DeviceType.OTHER,
          null,
          null,
          1,
          2,
          null,
          DeviceStatus.DECOMMISSIONED,
        },
        null);
  }

  private void seedFor(String rackCode, Object[] deviceA, Object[] deviceB) {
    Rack rack = rackRepository.findByCodeIgnoreCase(rackCode).orElse(null);
    if (rack == null) {
      return;
    }
    seed(rack, deviceA, 1);
    if (deviceB != null) {
      seed(rack, deviceB, 2);
    }
  }

  private void seed(Rack rack, Object[] fields, int sequence) {
    Device device = new Device();
    device.setRack(rack);
    device.setName((String) fields[0]);
    device.setDeviceType((DeviceType) fields[1]);
    device.setManufacturer((String) fields[2]);
    device.setModel((String) fields[3]);
    device.setPositionUStart((Integer) fields[4]);
    device.setHeightU((Integer) fields[5]);
    device.setPowerConsumptionW((Double) fields[6]);
    device.setStatus((DeviceStatus) fields[7]);
    device.setSerialNumber("SN-" + rack.getCode() + "-" + sequence);
    Instant now = Instant.now();
    device.setCreatedAt(now);
    device.setUpdatedAt(now);
    deviceRepository.save(device);
  }
}
