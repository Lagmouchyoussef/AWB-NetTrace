package com.awb.backend.core.repository;

import com.awb.backend.core.entity.ChecklistTemplateItem;
import com.awb.backend.core.entity.InterventionType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChecklistTemplateItemRepository
    extends JpaRepository<ChecklistTemplateItem, Long> {

  List<ChecklistTemplateItem> findByInterventionTypeOrderByStepOrderAsc(
      InterventionType interventionType);
}
