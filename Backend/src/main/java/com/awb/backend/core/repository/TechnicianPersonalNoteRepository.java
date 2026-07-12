package com.awb.backend.core.repository;

import com.awb.backend.core.entity.TechnicianPersonalNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianPersonalNoteRepository
    extends JpaRepository<TechnicianPersonalNote, Long> {

  List<TechnicianPersonalNote> findByAuthorIdOrderByUpdatedAtDesc(Long authorId);
}
