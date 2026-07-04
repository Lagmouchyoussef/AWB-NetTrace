package com.awb.backend.config;

import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.entity.RackContainment;
import com.awb.backend.core.entity.RackStatus;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.RoomRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds two demo racks per existing demo room on first startup (only if the table is empty). Looks
 * rooms up by code rather than assuming ids, so it stays correct regardless of seeder execution
 * order. Dev/demo data only.
 */
@Component
@Order(3)
public class RackSeeder implements CommandLineRunner {

  private final RackRepository rackRepository;
  private final RoomRepository roomRepository;

  public RackSeeder(RackRepository rackRepository, RoomRepository roomRepository) {
    this.rackRepository = rackRepository;
    this.roomRepository = roomRepository;
  }

  @Override
  public void run(String... args) {
    if (rackRepository.count() > 0) {
      return;
    }

    seedFor(
        "RM-CASA-A",
        new Object[] {
          "Rack Serveurs A1", "RK-CASA-A1", 42, 8.0, RackContainment.HOT_AISLE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Serveurs A2", "RK-CASA-A2", 42, 8.0, RackContainment.COLD_AISLE, RackStatus.ACTIVE,
        });
    seedFor(
        "RM-CASA-B",
        new Object[] {
          "Rack IA GPU B1", "RK-CASA-B1", 48, 30.0, RackContainment.NONE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack IA GPU B2", "RK-CASA-B2", 48, 30.0, RackContainment.NONE, RackStatus.ACTIVE,
        });
    seedFor(
        "RM-RABAT-A",
        new Object[] {
          "Rack Réseau A1", "RK-RABAT-A1", 45, 5.0, RackContainment.HOT_AISLE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Réseau A2", "RK-RABAT-A2", 45, 5.0, RackContainment.HOT_AISLE, RackStatus.ACTIVE,
        });
    seedFor(
        "RM-RABAT-B",
        new Object[] {
          "Rack Onduleurs B1", "RK-RABAT-B1", 42, 6.0, RackContainment.NONE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Onduleurs B2", "RK-RABAT-B2", 42, 6.0, RackContainment.NONE, RackStatus.RESERVED,
        });
    seedFor(
        "RM-TNG-A",
        new Object[] {
          "Rack Stockage A1", "RK-TNG-A1", 42, 10.0, RackContainment.COLD_AISLE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Stockage A2",
          "RK-TNG-A2",
          42,
          10.0,
          RackContainment.COLD_AISLE,
          RackStatus.MAINTENANCE,
        });
    seedFor(
        "RM-TNG-B",
        new Object[] {
          "Rack Électrique B1", "RK-TNG-B1", 42, 4.0, RackContainment.NONE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Électrique B2", "RK-TNG-B2", 42, 4.0, RackContainment.NONE, RackStatus.ACTIVE,
        });
    seedFor(
        "RM-RAK-A",
        new Object[] {
          "Rack Serveurs A1", "RK-RAK-A1", 42, 8.0, RackContainment.HOT_AISLE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Serveurs A2", "RK-RAK-A2", 42, 8.0, RackContainment.COLD_AISLE, RackStatus.ACTIVE,
        });
    seedFor(
        "RM-RAK-B",
        new Object[] {
          "Rack Climatisation B1", "RK-RAK-B1", 42, 3.0, RackContainment.NONE, RackStatus.ACTIVE,
        },
        new Object[] {
          "Rack Climatisation B2",
          "RK-RAK-B2",
          42,
          3.0,
          RackContainment.NONE,
          RackStatus.DECOMMISSIONED,
        });
  }

  private void seedFor(String roomCode, Object[] rackA, Object[] rackB) {
    Room room = roomRepository.findByCodeIgnoreCase(roomCode).orElse(null);
    if (room == null) {
      return;
    }
    seed(room, rackA);
    seed(room, rackB);
  }

  private void seed(Room room, Object[] fields) {
    Rack rack = new Rack();
    rack.setRoom(room);
    rack.setName((String) fields[0]);
    rack.setCode((String) fields[1]);
    rack.setHeightU((Integer) fields[2]);
    rack.setPowerCapacityKw((Double) fields[3]);
    rack.setContainment((RackContainment) fields[4]);
    rack.setStatus((RackStatus) fields[5]);
    Instant now = Instant.now();
    rack.setCreatedAt(now);
    rack.setUpdatedAt(now);
    rackRepository.save(rack);
  }
}
