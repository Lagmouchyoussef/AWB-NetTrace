package com.awb.backend.core.repository;

import com.awb.backend.core.entity.CablePathwaySegment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CablePathwaySegmentRepository extends JpaRepository<CablePathwaySegment, Long> {

  List<CablePathwaySegment> findByCableIdOrderBySequenceOrderAsc(Long cableId);

  void deleteByCableId(Long cableId);

  // Distinct, non-soft-deleted cables traversing any segment belonging to the given pathway -
  // the basis of a pathway's fill-rate computation.
  @Query(
      "select count(distinct cps.cable.id) from CablePathwaySegment cps "
          + "where cps.pathwaySegment.pathway.id = :pathwayId and cps.cable.deleted = false")
  long countDistinctCableIdByPathwaySegment_Pathway_Id(@Param("pathwayId") Long pathwayId);

  // Distinct, non-soft-deleted cables traversing this specific segment - the basis of a segment's
  // own fill-rate computation.
  @Query(
      "select count(distinct cps.cable.id) from CablePathwaySegment cps "
          + "where cps.pathwaySegment.id = :segmentId and cps.cable.deleted = false")
  long countDistinctCableIdByPathwaySegmentId(@Param("segmentId") Long segmentId);
}
