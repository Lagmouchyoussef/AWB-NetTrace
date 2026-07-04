package com.awb.backend.config;

import com.awb.backend.core.entity.Cable;
import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.core.entity.CableType;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.repository.CableRepository;
import com.awb.backend.core.repository.DeviceRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo physical cable runs between existing demo devices on first startup (only if the table
 * is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(8)
public class CableSeeder implements CommandLineRunner {

  private final CableRepository cableRepository;
  private final DeviceRepository deviceRepository;

  public CableSeeder(CableRepository cableRepository, DeviceRepository deviceRepository) {
    this.cableRepository = cableRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (cableRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "SN-RK-CASA-A2-1",
        "Cable Serveur-Switch Casablanca",
        "CB-CASA-01",
        CableType.FIBER_OM4,
        5.0);
    seed(
        "SN-RK-CASA-B1-1",
        "SN-RK-CASA-B1-2",
        "Cable Interconnexion IA GPU",
        "CB-CASA-02",
        CableType.AOC,
        2.0);
    seed(
        "SN-RK-RABAT-A1-1",
        "SN-RK-RABAT-A1-2",
        "Cable Spine-BorderLeaf Rabat",
        "CB-RABAT-01",
        CableType.FIBER_OS2,
        10.0);
    seed(
        "SN-RK-TNG-A1-1",
        "SN-RK-TNG-A1-2",
        "Cable Stockage Tanger",
        "CB-TNG-01",
        CableType.DAC_COPPER,
        3.0);
  }

  private void seed(
      String sourceSerial,
      String targetSerial,
      String name,
      String code,
      CableType cableType,
      double lengthMeters) {
    Device source = deviceRepository.findBySerialNumberIgnoreCase(sourceSerial).orElse(null);
    Device target = deviceRepository.findBySerialNumberIgnoreCase(targetSerial).orElse(null);
    if (source == null || target == null) {
      return;
    }

    Cable cable = new Cable();
    cable.setSourceDevice(source);
    cable.setTargetDevice(target);
    cable.setName(name);
    cable.setCode(code);
    cable.setCableType(cableType);
    cable.setLengthMeters(lengthMeters);
    cable.setStatus(CableStatus.CONNECTED);
    Instant now = Instant.now();
    cable.setCreatedAt(now);
    cable.setUpdatedAt(now);
    cableRepository.save(cable);
  }
}
