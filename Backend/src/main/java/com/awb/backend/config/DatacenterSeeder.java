package com.awb.backend.config;

import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.DatacenterTier;
import com.awb.backend.core.repository.DatacenterRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds a handful of realistic demo datacenters on first startup (only if the table is empty).
 * Dev/demo data only. Ordered ahead of the Room/Rack/Device seeders, which look up these rows by
 * code to attach themselves to.
 */
@Component
@Order(1)
public class DatacenterSeeder implements CommandLineRunner {

  private final DatacenterRepository datacenterRepository;

  public DatacenterSeeder(DatacenterRepository datacenterRepository) {
    this.datacenterRepository = datacenterRepository;
  }

  @Override
  public void run(String... args) {
    if (datacenterRepository.count() > 0) {
      return;
    }

    seed(
        "Casablanca Nearshore",
        "DC-CASA-01",
        "Casablanca",
        "Morocco",
        DatacenterTier.TIER_III,
        DatacenterStatus.ACTIVE,
        1200.0,
        850.0);
    seed(
        "Rabat Technopolis",
        "DC-RABAT-01",
        "Rabat",
        "Morocco",
        DatacenterTier.TIER_III,
        DatacenterStatus.ACTIVE,
        800.0,
        600.0);
    seed(
        "Tanger Med",
        "DC-TNG-01",
        "Tangier",
        "Morocco",
        DatacenterTier.TIER_II,
        DatacenterStatus.MAINTENANCE,
        450.0,
        320.0);
    seed(
        "Marrakech Menara",
        "DC-RAK-01",
        "Marrakech",
        "Morocco",
        DatacenterTier.TIER_II,
        DatacenterStatus.ACTIVE,
        300.0,
        250.0);
  }

  private void seed(
      String name,
      String code,
      String city,
      String country,
      DatacenterTier tier,
      DatacenterStatus status,
      double totalPowerKw,
      double totalSpaceSqm) {
    Datacenter datacenter = new Datacenter();
    datacenter.setName(name);
    datacenter.setCode(code);
    datacenter.setCity(city);
    datacenter.setCountry(country);
    datacenter.setTier(tier);
    datacenter.setStatus(status);
    datacenter.setTotalPowerKw(totalPowerKw);
    datacenter.setTotalSpaceSqm(totalSpaceSqm);
    Instant now = Instant.now();
    datacenter.setCreatedAt(now);
    datacenter.setUpdatedAt(now);
    datacenterRepository.save(datacenter);
  }
}
