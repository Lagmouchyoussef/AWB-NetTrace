package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Device;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DeviceRepository
    extends JpaRepository<Device, Long>, JpaSpecificationExecutor<Device> {

  boolean existsBySerialNumberIgnoreCase(String serialNumber);

  boolean existsBySerialNumberIgnoreCaseAndIdNot(String serialNumber, Long id);

  Optional<Device> findBySerialNumberIgnoreCase(String serialNumber);

  List<Device> findByRackIdAndDeletedFalse(Long rackId);
}
