package com.awb.backend.roles.approver.controller;

import com.awb.backend.core.dto.InterventionRejectRequest;
import com.awb.backend.core.dto.InterventionRequest;
import com.awb.backend.core.dto.InterventionResponse;
import com.awb.backend.core.entity.ApprovalStatus;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.roles.superadmin.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Delegates to the same InterventionService DC Admin uses (see DcAdminInterventionController),
// but with no datacenter scoping: Approver is a change-management role with no "assigned
// datacenters" concept, so it passes null for the scope everywhere - InterventionService already
// treats null as "no restriction" (the same convention Super Admin relies on implicitly).
@RestController
@RequestMapping("/api/roles/approver/interventions")
public class ApproverInterventionController {

  private final InterventionService interventionService;

  public ApproverInterventionController(InterventionService interventionService) {
    this.interventionService = interventionService;
  }

  @GetMapping("/approval-queue")
  public Page<InterventionResponse> approvalQueue(Pageable pageable) {
    return interventionService.getApprovalQueue(null, pageable);
  }

  @PostMapping("/{id}/approve")
  public InterventionResponse approve(@PathVariable Long id, Authentication authentication) {
    return interventionService.approve(id, authentication.getName(), null);
  }

  @PostMapping("/{id}/reject")
  public InterventionResponse reject(
      @PathVariable Long id,
      @Valid @RequestBody InterventionRejectRequest request,
      Authentication authentication) {
    return interventionService.reject(id, authentication.getName(), request.getComment(), null);
  }

  // Unscoped read-only visibility across every intervention regardless of status/decision - used
  // by "All Interventions" (no filters) and the "Validated Interventions Calendar"
  // (approvalStatus=APPROVED) screens. No update here: Approver never manages the intervention
  // record itself, only decides on pending ones (see approve/reject above) - the one exception is
  // withdrawing its own still-pending request, see deleteMyRequest below.
  @GetMapping
  public Page<InterventionResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      @RequestParam(required = false) ApprovalStatus approvalStatus,
      Pageable pageable) {
    return interventionService.list(search, status, priority, approvalStatus, pageable);
  }

  // This approver's own past decisions (Decision History / Reports screens) - approvalStatus is
  // optional: omitted returns both APPROVED and REJECTED.
  @GetMapping("/decisions")
  public Page<InterventionResponse> decisions(
      @RequestParam(required = false) ApprovalStatus approvalStatus,
      Pageable pageable,
      Authentication authentication) {
    return interventionService.listDecisions(authentication.getName(), approvalStatus, pageable);
  }

  // "My Requests" - the Approver acting as a requester (same createPendingApproval path Network
  // Engineer's own request flow uses). A request submitted here is never in this same user's own
  // approval queue for a decision - requireNotOwnRequest in InterventionService.approve/reject
  // enforces that server-side regardless of what the UI shows.
  @GetMapping("/my-requests")
  public Page<InterventionResponse> myRequests(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) InterventionStatus status,
      @RequestParam(required = false) InterventionPriority priority,
      Pageable pageable,
      Authentication authentication) {
    return interventionService.listByRequester(
        authentication.getName(), search, status, priority, pageable);
  }

  @PostMapping("/my-requests")
  public ResponseEntity<InterventionResponse> createMyRequest(
      @Valid @RequestBody InterventionRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(interventionService.createPendingApproval(request, authentication.getName()));
  }

  // Withdraw one of your own requests - only while it's still PENDING (see
  // InterventionService.deleteOwnRequest for why), and only your own: a 404 either way if it
  // doesn't exist or belongs to someone else, so this can't be used to probe other users' ids.
  @DeleteMapping("/my-requests/{id}")
  public ResponseEntity<Void> deleteMyRequest(@PathVariable Long id, Authentication authentication) {
    interventionService.deleteOwnRequest(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
