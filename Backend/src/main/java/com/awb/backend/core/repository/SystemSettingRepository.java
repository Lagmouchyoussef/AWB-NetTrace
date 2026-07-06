package com.awb.backend.core.repository;

import com.awb.backend.core.entity.SystemSetting;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SystemSettingRepository
    extends JpaRepository<SystemSetting, Long>, JpaSpecificationExecutor<SystemSetting> {

  boolean existsBySettingKeyIgnoreCase(String settingKey);

  boolean existsBySettingKeyIgnoreCaseAndIdNot(String settingKey, Long id);

  Optional<SystemSetting> findBySettingKeyIgnoreCase(String settingKey);
}
