package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Rack;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RackRepository extends JpaRepository<Rack, Long>, JpaSpecificationExecutor<Rack> {

  boolean existsByCodeIgnoreCase(String code);

  boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

  Optional<Rack> findByCodeIgnoreCase(String code);
}
