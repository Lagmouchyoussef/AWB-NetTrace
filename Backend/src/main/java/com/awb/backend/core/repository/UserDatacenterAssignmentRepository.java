package com.awb.backend.core.repository;

import com.awb.backend.core.entity.UserDatacenterAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDatacenterAssignmentRepository
    extends JpaRepository<UserDatacenterAssignment, Long> {

  List<UserDatacenterAssignment> findByUserId(Long userId);
}
