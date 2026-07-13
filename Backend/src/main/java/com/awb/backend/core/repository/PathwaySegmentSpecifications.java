package com.awb.backend.core.repository;

import com.awb.backend.core.entity.PathwaySegment;
import org.springframework.data.jpa.domain.Specification;

public final class PathwaySegmentSpecifications {

  private PathwaySegmentSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<PathwaySegment> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<PathwaySegment> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
  }

  public static Specification<PathwaySegment> hasPathwayId(Long pathwayId) {
    if (pathwayId == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("pathway").get("id"), pathwayId);
  }
}
