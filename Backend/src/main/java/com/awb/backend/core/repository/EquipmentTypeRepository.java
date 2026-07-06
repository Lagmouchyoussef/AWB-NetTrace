package com.awb.backend.core.repository;

import com.awb.backend.core.entity.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EquipmentTypeRepository
    extends JpaRepository<EquipmentType, Long>, JpaSpecificationExecutor<EquipmentType> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
