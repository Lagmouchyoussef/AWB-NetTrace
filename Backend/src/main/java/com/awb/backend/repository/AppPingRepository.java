package com.awb.backend.repository;

import com.awb.backend.entity.AppPing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppPingRepository extends JpaRepository<AppPing, Long> {

  AppPing findFirstByOrderByIdDesc();
}
