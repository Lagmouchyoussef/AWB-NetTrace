package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Pathway;
import com.awb.backend.core.entity.PathwayStatus;
import com.awb.backend.core.entity.PathwayType;
import org.springframework.data.jpa.domain.Specification;

public final class PathwaySpecifications {

  private PathwaySpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<Pathway> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<Pathway> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) ->
        cb.or(
            cb.like(cb.lower(root.get("name")), pattern),
            cb.like(cb.lower(root.get("code")), pattern));
  }

  public static Specification<Pathway> hasStatus(PathwayStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<Pathway> hasType(PathwayType type) {
    if (type == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("type"), type);
  }

  public static Specification<Pathway> hasDatacenterId(Long datacenterId) {
    if (datacenterId == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("datacenter").get("id"), datacenterId);
  }
}
