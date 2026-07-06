package com.awb.backend.core.repository;

import com.awb.backend.core.entity.RealTimeDashboard;
import com.awb.backend.core.entity.RealTimeDashboardStatus;
import org.springframework.data.jpa.domain.Specification;

public final class RealTimeDashboardSpecifications {

  private RealTimeDashboardSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<RealTimeDashboard> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<RealTimeDashboard> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) ->
        cb.or(
            cb.like(cb.lower(root.get("name")), pattern),
            cb.like(cb.lower(root.get("code")), pattern));
  }

  public static Specification<RealTimeDashboard> hasStatus(RealTimeDashboardStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }
}
