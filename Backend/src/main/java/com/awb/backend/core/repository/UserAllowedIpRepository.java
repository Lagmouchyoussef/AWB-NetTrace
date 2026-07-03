package com.awb.backend.core.repository;

import com.awb.backend.core.entity.UserAllowedIp;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAllowedIpRepository extends JpaRepository<UserAllowedIp, Long> {

  List<UserAllowedIp> findByUserId(Long userId);
}
