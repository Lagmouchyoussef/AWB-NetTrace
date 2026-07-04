package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Datacenter;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DatacenterRepository
    extends JpaRepository<Datacenter, Long>, JpaSpecificationExecutor<Datacenter> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

  Optional<Datacenter> findByCodeIgnoreCase(String code);
}
