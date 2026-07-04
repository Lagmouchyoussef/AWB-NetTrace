package com.awb.backend.core.repository;

import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
import org.springframework.data.jpa.domain.Specification;

public final class DeviceSpecifications {

  private DeviceSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<Device> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<Device> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) ->
        cb.or(
            cb.like(cb.lower(root.get("name")), pattern),
            cb.like(cb.lower(root.get("serialNumber")), pattern));
  }

  public static Specification<Device> hasStatus(DeviceStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<Device> hasRackId(Long rackId) {
    if (rackId == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("rack").get("id"), rackId);
  }
}
