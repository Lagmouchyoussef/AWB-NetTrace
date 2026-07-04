package com.awb.backend.config;

import com.awb.backend.core.entity.CoolingType;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.entity.RoomType;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.RoomRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds two demo rooms per existing demo datacenter on first startup (only if the table is empty).
 * Looks datacenters up by code rather than assuming ids, so it stays correct regardless of seeder
 * execution order. Dev/demo data only.
 */
@Component
@Order(2)
public class RoomSeeder implements CommandLineRunner {

  private final RoomRepository roomRepository;
  private final DatacenterRepository datacenterRepository;

  public RoomSeeder(RoomRepository roomRepository, DatacenterRepository datacenterRepository) {
    this.roomRepository = roomRepository;
    this.datacenterRepository = datacenterRepository;
  }

  @Override
  public void run(String... args) {
    if (roomRepository.count() > 0) {
      return;
    }

    seedFor(
        "DC-CASA-01",
        "Casablanca",
        new Object[] {
          "Salle Serveurs A", "RM-CASA-A", RoomType.SERVER_ROOM, CoolingType.IN_ROW,
        },
        new Object[] {
          "Salle IA Haute Densité",
          "RM-CASA-B",
          RoomType.SERVER_ROOM,
          CoolingType.DIRECT_LIQUID_COOLING,
        });
    seedFor(
        "DC-RABAT-01",
        "Rabat",
        new Object[] {
          "Salle Réseau", "RM-RABAT-A", RoomType.NETWORK_ROOM, CoolingType.CRAH,
        },
        new Object[] {
          "Salle Onduleurs", "RM-RABAT-B", RoomType.UPS_ROOM, CoolingType.CRAC,
        });
    seedFor(
        "DC-TNG-01",
        "Tanger",
        new Object[] {
          "Salle Stockage", "RM-TNG-A", RoomType.STORAGE_ROOM, CoolingType.CRAC,
        },
        new Object[] {
          "Salle Électrique", "RM-TNG-B", RoomType.ELECTRICAL_ROOM, CoolingType.CRAC,
        });
    seedFor(
        "DC-RAK-01",
        "Marrakech",
        new Object[] {
          "Salle Serveurs Principale", "RM-RAK-A", RoomType.SERVER_ROOM, CoolingType.CRAH,
        },
        new Object[] {
          "Salle Climatisation", "RM-RAK-B", RoomType.COOLING_PLANT, CoolingType.CRAH,
        });
  }

  private void seedFor(String datacenterCode, String floor, Object[] roomA, Object[] roomB) {
    Datacenter datacenter = datacenterRepository.findByCodeIgnoreCase(datacenterCode).orElse(null);
    if (datacenter == null) {
      return;
    }
    seed(datacenter, floor, roomA);
    seed(datacenter, floor, roomB);
  }

  private void seed(Datacenter datacenter, String floor, Object[] fields) {
    Room room = new Room();
    room.setDatacenter(datacenter);
    room.setName((String) fields[0]);
    room.setCode((String) fields[1]);
    room.setRoomType((RoomType) fields[2]);
    room.setCoolingType((CoolingType) fields[3]);
    room.setFloor(floor);
    room.setStatus(RoomStatus.ACTIVE);
    Instant now = Instant.now();
    room.setCreatedAt(now);
    room.setUpdatedAt(now);
    roomRepository.save(room);
  }
}
