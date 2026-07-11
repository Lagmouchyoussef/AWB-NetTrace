package com.awb.backend.core.repository;

import com.awb.backend.core.entity.InterventionTechnicianNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionTechnicianNoteRepository
    extends JpaRepository<InterventionTechnicianNote, Long> {

  List<InterventionTechnicianNote> findByInterventionIdOrderByCreatedAtDesc(Long interventionId);
}
