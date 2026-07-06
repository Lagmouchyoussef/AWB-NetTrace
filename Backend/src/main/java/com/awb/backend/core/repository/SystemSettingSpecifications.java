package com.awb.backend.core.repository;

import com.awb.backend.core.entity.SystemSetting;
import com.awb.backend.core.entity.SystemSettingCategory;
import org.springframework.data.jpa.domain.Specification;

public final class SystemSettingSpecifications {

  private SystemSettingSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<SystemSetting> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<SystemSetting> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("settingKey")), pattern);
  }

  public static Specification<SystemSetting> hasCategory(SystemSettingCategory category) {
    if (category == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("category"), category);
  }
}
