package com.awb.backend.config;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.PathTrace;
import com.awb.backend.core.entity.PathTraceStatus;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.PathTraceRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Seeds demo end-to-end path traces between existing demo devices on first startup (only if the
 * table is empty). Looks devices up by serial number rather than assuming ids, so it stays correct
 * regardless of seeder execution order. Dev/demo data only.
 */
@Component
@Order(10)
public class PathTraceSeeder implements CommandLineRunner {

  private final PathTraceRepository pathTraceRepository;
  private final DeviceRepository deviceRepository;

  public PathTraceSeeder(
      PathTraceRepository pathTraceRepository, DeviceRepository deviceRepository) {
    this.pathTraceRepository = pathTraceRepository;
    this.deviceRepository = deviceRepository;
  }

  @Override
  public void run(String... args) {
    if (pathTraceRepository.count() > 0) {
      return;
    }

    seed(
        "SN-RK-CASA-A1-1",
        "SN-RK-RABAT-A1-1",
        "Trace Casablanca-Rabat Core",
        "PT-01",
        3,
        45.5,
        PathTraceStatus.TRACED,
        Instant.now());
    seed(
        "SN-RK-CASA-B1-1",
        "SN-RK-CASA-A2-1",
        "Trace IA GPU vers Switch",
        "PT-02",
        2,
        12.0,
        PathTraceStatus.TRACED,
        Instant.now());
    seed(
        "SN-RK-TNG-A1-1",
        "SN-RK-RAK-A2-1",
        "Trace Tanger-Marrakech",
        "PT-03",
        4,
        null,
        PathTraceStatus.PENDING,
        null);
  }

  private void seed(
      String sourceSerial,
      String targetSerial,
      String name,
      String code,
      int hopCount,
      Double totalLengthMeters,
      PathTraceStatus status,
      Instant tracedAt) {
    Device source = deviceRepository.findBySerialNumberIgnoreCase(sourceSerial).orElse(null);
    Device target = deviceRepository.findBySerialNumberIgnoreCase(targetSerial).orElse(null);
    if (source == null || target == null) {
      return;
    }

    PathTrace pathTrace = new PathTrace();
    pathTrace.setSourceDevice(source);
    pathTrace.setTargetDevice(target);
    pathTrace.setName(name);
    pathTrace.setCode(code);
    pathTrace.setHopCount(hopCount);
    pathTrace.setTotalLengthMeters(totalLengthMeters);
    pathTrace.setStatus(status);
    pathTrace.setTracedAt(tracedAt);
    Instant now = Instant.now();
    pathTrace.setCreatedAt(now);
    pathTrace.setUpdatedAt(now);
    pathTraceRepository.save(pathTrace);
  }
}
