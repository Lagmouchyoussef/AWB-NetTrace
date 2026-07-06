package com.awb.backend.core.repository;

import com.awb.backend.core.entity.CarrierCircuit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CarrierCircuitRepository
    extends JpaRepository<CarrierCircuit, Long>, JpaSpecificationExecutor<CarrierCircuit> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
