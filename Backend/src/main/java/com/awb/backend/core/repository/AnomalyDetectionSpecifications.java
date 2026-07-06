package com.awb.backend.core.repository;

import com.awb.backend.core.entity.AnomalyDetection;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import org.springframework.data.jpa.domain.Specification;

public final class AnomalyDetectionSpecifications {

  private AnomalyDetectionSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<AnomalyDetection> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<AnomalyDetection> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("title")), pattern);
  }

  public static Specification<AnomalyDetection> hasStatus(AnomalyDetectionStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<AnomalyDetection> hasSeverity(AnomalySeverity severity) {
    if (severity == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("severity"), severity);
  }
}
