package com.awb.backend.config;

import com.awb.backend.core.entity.EquipmentCategory;
import com.awb.backend.core.entity.EquipmentType;
import com.awb.backend.core.entity.EquipmentTypeStatus;
import com.awb.backend.core.repository.EquipmentTypeRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a small demo equipment type catalog on first startup (only if the table is empty). Dev/demo
 * data only.
 */
@Component
@Order(18)
public class EquipmentTypeSeeder implements CommandLineRunner {

  private final EquipmentTypeRepository equipmentTypeRepository;

  public EquipmentTypeSeeder(EquipmentTypeRepository equipmentTypeRepository) {
    this.equipmentTypeRepository = equipmentTypeRepository;
  }

  @Override
  public void run(String... args) {
    if (equipmentTypeRepository.count() > 0) {
      return;
    }

    seed("Serveur rack 1U", "EQT-01", EquipmentCategory.SERVER, "Dell", 1, 750);
    seed(
        "Nœud accélérateur IA GPU",
        "EQT-02",
        EquipmentCategory.SERVER,
        "NVIDIA/Supermicro",
        4,
        6000);
    seed("Switch spine 32x100G", "EQT-03", EquipmentCategory.NETWORKING, "Cisco", 1, 450);
    seed("Baie de stockage NVMe", "EQT-04", EquipmentCategory.STORAGE, "NetApp", 2, 900);
    seed("PDU intelligente triphasée", "EQT-05", EquipmentCategory.POWER, "Vertiv", 0, 100);
  }

  private void seed(
      String name,
      String code,
      EquipmentCategory category,
      String manufacturer,
      Integer defaultRackUnits,
      Integer defaultPowerWatts) {
    EquipmentType equipmentType = new EquipmentType();
    equipmentType.setName(name);
    equipmentType.setCode(code);
    equipmentType.setCategory(category);
    equipmentType.setManufacturer(manufacturer);
    equipmentType.setDefaultRackUnits(defaultRackUnits);
    equipmentType.setDefaultPowerWatts(defaultPowerWatts);
    equipmentType.setStatus(EquipmentTypeStatus.ACTIVE);
    Instant now = Instant.now();
    equipmentType.setCreatedAt(now);
    equipmentType.setUpdatedAt(now);
    equipmentTypeRepository.save(equipmentType);
  }
}
