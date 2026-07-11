package com.awb.backend.core.repository;

import com.awb.backend.core.entity.InterventionChecklistItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionChecklistItemRepository
    extends JpaRepository<InterventionChecklistItem, Long> {

  List<InterventionChecklistItem> findByInterventionIdOrderByStepOrderAsc(Long interventionId);

  boolean existsByInterventionId(Long interventionId);

  long countByInterventionIdAndCompletedFalse(Long interventionId);
}
