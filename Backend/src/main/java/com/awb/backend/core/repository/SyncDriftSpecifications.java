package com.awb.backend.core.repository;

import com.awb.backend.core.entity.DriftSeverity;
import com.awb.backend.core.entity.SyncDrift;
import com.awb.backend.core.entity.SyncDriftStatus;
import org.springframework.data.jpa.domain.Specification;

public final class SyncDriftSpecifications {

  private SyncDriftSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<SyncDrift> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<SyncDrift> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("title")), pattern);
  }

  public static Specification<SyncDrift> hasStatus(SyncDriftStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<SyncDrift> hasSeverity(DriftSeverity severity) {
    if (severity == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("severity"), severity);
  }
}
