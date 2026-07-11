package com.awb.backend.core.repository;

import com.awb.backend.core.entity.InterventionPhoto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterventionPhotoRepository extends JpaRepository<InterventionPhoto, Long> {

  List<InterventionPhoto> findByInterventionIdOrderByCreatedAtAsc(Long interventionId);
}
