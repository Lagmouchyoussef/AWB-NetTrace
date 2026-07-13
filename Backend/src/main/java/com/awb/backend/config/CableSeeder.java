package com.awb.backend.config;

import com.awb.backend.core.entity.Cable;
import com.awb.backend.core.entity.CablePathwaySegment;
import com.awb.backend.core.entity.CableStatus;
import com.awb.backend.core.entity.CableType;
import com.awb.backend.core.entity.Connector;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.PathwaySegment;
import com.awb.backend.core.repository.CablePathwaySegmentRepository;
import com.awb.backend.core.repository.CableRepository;
import com.awb.backend.core.repository.ConnectorRepository;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.PathwaySegmentRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo physical cable runs between existing demo devices on first startup (only if the table
 * is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 *
 * <p>Runs after {@link ConnectorSeeder} (so each cable can reference real source/target
 * connectors) and after {@link PathwaySeeder}/{@link PathwaySegmentSeeder} (so a subset of cables
 * can be assigned a physical route through pathway segments) - see the {@code @Order} values on
 * those seeders.
 */
@Component
@Order(12)
public class CableSeeder implements CommandLineRunner {

  private final CableRepository cableRepository;
  private final DeviceRepository deviceRepository;
  private final ConnectorRepository connectorRepository;
  private final PathwaySegmentRepository pathwaySegmentRepository;
  private final CablePathwaySegmentRepository cablePathwaySegmentRepository;

  public CableSeeder(
      CableRepository cableRepository,
      DeviceRepository deviceRepository,
      ConnectorRepository connectorRepository,
      PathwaySegmentRepository pathwaySegmentRepository,
      CablePathwaySegmentRepository cablePathwaySegmentRepository) {
    this.cableRepository = cableRepository;
    this.deviceRepository = deviceRepository;
    this.connectorRepository = connectorRepository;
    this.pathwaySegmentRepository = pathwaySegmentRepository;
    this.cablePathwaySegmentRepository = cablePathwaySegmentRepository;
  }

  @Override
  public void run(String... args) {
    if (cableRepository.count() > 0) {
      return;
    }

    // Each cable now demonstrates a genuine port-to-port link (source/target connectors), and a
    // realistic subset also gets a physical route through pathway segments. CB-CASA-01 and
    // CB-CASA-02 both route through PW-CASA-01's segments so that pathway's fill rate approaches/
    // exceeds its default 80% alert threshold in the demo data.
    seed(
        "SN-RK-CASA-A1-1",
        "SN-RK-CASA-A2-1",
        "CN-CASA-03",
        "CN-CASA-02",
        "Cable Serveur-Switch Casablanca",
        "CB-CASA-01",
        CableType.FIBER_OM4,
        5.0,
        List.of("PWS-CASA-01-1", "PWS-CASA-01-2"));
    seed(
        "SN-RK-CASA-B1-1",
        "SN-RK-CASA-B1-2",
        "CN-CASA-01",
        "CN-CASA-04",
        "Cable Interconnexion IA GPU",
        "CB-CASA-02",
        CableType.AOC,
        2.0,
        List.of("PWS-CASA-01-1"));
    seed(
        "SN-RK-RABAT-A1-1",
        "SN-RK-RABAT-A1-2",
        "CN-RABAT-01",
        "CN-RABAT-02",
        "Cable Spine-BorderLeaf Rabat",
        "CB-RABAT-01",
        CableType.FIBER_OS2,
        10.0,
        List.of("PWS-RABAT-01-1"));
    seed(
        "SN-RK-TNG-A1-1",
        "SN-RK-TNG-A1-2",
        "CN-TNG-01",
        "CN-TNG-02",
        "Cable Stockage Tanger",
        "CB-TNG-01",
        CableType.DAC_COPPER,
        3.0,
        List.of());
  }

  private void seed(
      String sourceSerial,
      String targetSerial,
      String sourceConnectorCode,
      String targetConnectorCode,
      String name,
      String code,
      CableType cableType,
      double lengthMeters,
      List<String> pathwaySegmentCodes) {
    Device source = deviceRepository.findBySerialNumberIgnoreCase(sourceSerial).orElse(null);
    Device target = deviceRepository.findBySerialNumberIgnoreCase(targetSerial).orElse(null);
    if (source == null || target == null) {
      return;
    }
    Connector sourceConnector =
        connectorRepository.findByCodeIgnoreCase(sourceConnectorCode).orElse(null);
    Connector targetConnector =
        connectorRepository.findByCodeIgnoreCase(targetConnectorCode).orElse(null);

    Cable cable = new Cable();
    cable.setSourceDevice(source);
    cable.setTargetDevice(target);
    cable.setSourceConnector(sourceConnector);
    cable.setTargetConnector(targetConnector);
    cable.setName(name);
    cable.setCode(code);
    cable.setCableType(cableType);
    cable.setLengthMeters(lengthMeters);
    cable.setStatus(CableStatus.CONNECTED);
    Instant now = Instant.now();
    cable.setCreatedAt(now);
    cable.setUpdatedAt(now);
    cable = cableRepository.save(cable);

    int sequenceOrder = 0;
    for (String segmentCode : pathwaySegmentCodes) {
      PathwaySegment segment =
          pathwaySegmentRepository.findByCodeIgnoreCase(segmentCode).orElse(null);
      if (segment == null) {
        continue;
      }
      CablePathwaySegment assignment = new CablePathwaySegment();
      assignment.setCable(cable);
      assignment.setPathwaySegment(segment);
      assignment.setSequenceOrder(sequenceOrder++);
      assignment.setCreatedAt(now);
      cablePathwaySegmentRepository.save(assignment);
    }
  }
}
