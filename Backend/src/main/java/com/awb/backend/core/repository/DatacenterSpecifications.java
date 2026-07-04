package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.DatacenterTier;
import org.springframework.data.jpa.domain.Specification;

public final class DatacenterSpecifications {

  private DatacenterSpecifications() {}

  public static Specification<Datacenter> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<Datacenter> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) ->
        cb.or(
            cb.like(cb.lower(root.get("name")), pattern),
            cb.like(cb.lower(root.get("code")), pattern),
            cb.like(cb.lower(root.get("city")), pattern));
  }

  public static Specification<Datacenter> hasStatus(DatacenterStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<Datacenter> hasTier(DatacenterTier tier) {
    if (tier == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("tier"), tier);
  }
}
