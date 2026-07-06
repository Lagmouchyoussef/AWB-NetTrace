package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.RolePermission;
import org.springframework.data.jpa.domain.Specification;

public final class RolePermissionSpecifications {

  private RolePermissionSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<RolePermission> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<RolePermission> hasRole(Role role) {
    if (role == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("role"), role);
  }

  public static Specification<RolePermission> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> {
      var permission = root.join("permission");
      return cb.or(
          cb.like(cb.lower(permission.get("code")), pattern),
          cb.like(cb.lower(permission.get("name")), pattern));
    };
  }
}
