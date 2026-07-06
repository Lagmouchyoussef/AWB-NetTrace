package com.awb.backend.core.repository;

import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.AuditLog;
import org.springframework.data.jpa.domain.Specification;

public final class AuditLogSpecifications {

  private AuditLogSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<AuditLog> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<AuditLog> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) ->
        cb.or(
            cb.like(cb.lower(root.get("actorUsername")), pattern),
            cb.like(cb.lower(root.get("entityType")), pattern));
  }

  public static Specification<AuditLog> hasAction(AuditAction action) {
    if (action == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("action"), action);
  }
}
