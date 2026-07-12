package com.awb.backend.core.repository;

import com.awb.backend.core.entity.ApprovalStatus;
import com.awb.backend.core.entity.Intervention;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import java.util.Collection;
import org.springframework.data.jpa.domain.Specification;

public final class InterventionSpecifications {

  private InterventionSpecifications() {}

  // Each filter returns an always-true predicate when its criterion is absent, rather than null:
  // this Spring Data JPA version's Specification#and rejects a null argument outright.
  public static Specification<Intervention> notDeleted() {
    return (root, query, cb) -> cb.isFalse(root.get("deleted"));
  }

  public static Specification<Intervention> search(String search) {
    if (search == null || search.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    String pattern = "%" + search.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("title")), pattern);
  }

  public static Specification<Intervention> hasStatus(InterventionStatus status) {
    if (status == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("status"), status);
  }

  public static Specification<Intervention> hasPriority(InterventionPriority priority) {
    if (priority == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("priority"), priority);
  }

  public static Specification<Intervention> hasApprovalStatus(ApprovalStatus approvalStatus) {
    if (approvalStatus == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("approvalStatus"), approvalStatus);
  }

  // Personal-scope filter for roles that may only ever see their own requests (e.g. Network
  // Engineer's "My Intervention Requests") - never combined with hasDatacenterIdIn, which is
  // DC Admin's own, broader scoping mechanism.
  public static Specification<Intervention> requestedByUsername(String username) {
    if (username == null || username.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("requestedBy").get("username"), username);
  }

  // Decision-history filter for the Approver role - who decided (approved or rejected), not who
  // requested. PENDING requests never have approvedBy set, so this alone already excludes them.
  public static Specification<Intervention> approvedByUsername(String username) {
    if (username == null || username.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("approvedBy").get("username"), username);
  }

  // Personal-scope filter for the Technician role - only interventions assigned to them, ever.
  public static Specification<Intervention> assignedToUsername(String username) {
    if (username == null || username.isBlank()) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.equal(root.get("assignedTechnician").get("username"), username);
  }

  // Interventions have no direct datacenter FK - scoped through device -> rack -> room ->
  // datacenter, same multi-hop join pattern used for other DC-Admin-scoped entities.
  public static Specification<Intervention> hasDatacenterIdIn(Collection<Long> datacenterIds) {
    if (datacenterIds == null || datacenterIds.isEmpty()) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) ->
        root.get("device").get("rack").get("room").get("datacenter").get("id").in(datacenterIds);
  }
}
