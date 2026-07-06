package com.awb.backend.core.repository;

import com.awb.backend.core.entity.AiInsight;
import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import org.springframework.data.jpa.domain.Specification;

public final class AiInsightSpecifications {

  private AiInsightSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<AiInsight> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<AiInsight> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("title")), pattern);
  }

  public static Specification<AiInsight> hasStatus(AiInsightStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<AiInsight> hasSeverity(AiInsightSeverity severity) {
    if (severity == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("severity"), severity);
  }

  public static Specification<AiInsight> hasType(AiInsightType type) {
    if (type == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("insightType"), type);
  }
}
