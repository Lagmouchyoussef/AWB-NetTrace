package com.awb.backend.core.repository;

import com.awb.backend.core.entity.PathwaySegment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PathwaySegmentRepository
    extends JpaRepository<PathwaySegment, Long>, JpaSpecificationExecutor<PathwaySegment> {

  List<PathwaySegment> findByPathwayIdOrderByOrdinalAsc(Long pathwayId);

  // Used by PathwaySeeder-adjacent seeders (CableSeeder) to look up a specific demo segment by
  // its parent pathway's code and its position, without assuming ids.
  Optional<PathwaySegment> findByPathway_CodeIgnoreCaseAndOrdinal(String pathwayCode, Integer ordinal);
}
