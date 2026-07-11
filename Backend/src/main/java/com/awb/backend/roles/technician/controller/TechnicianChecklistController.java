package com.awb.backend.roles.technician.controller;

import com.awb.backend.roles.technician.dto.ChecklistItemResponse;
import com.awb.backend.roles.technician.dto.ChecklistToggleRequest;
import com.awb.backend.roles.technician.service.TechnicianExecutionService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Steps are auto-generated from the fixed per-InterventionType template on first access - a
// technician only ever toggles completion, never creates/edits/removes a step.
@RestController
@RequestMapping("/api/roles/technician/interventions/{interventionId}/checklist")
public class TechnicianChecklistController {

  private final TechnicianExecutionService executionService;

  public TechnicianChecklistController(TechnicianExecutionService executionService) {
    this.executionService = executionService;
  }

  @GetMapping
  public List<ChecklistItemResponse> list(
      @PathVariable Long interventionId, Authentication authentication) {
    return executionService.getChecklist(interventionId, authentication.getName());
  }

  @PatchMapping("/{itemId}")
  public ChecklistItemResponse toggle(
      @PathVariable Long interventionId,
      @PathVariable Long itemId,
      @RequestBody ChecklistToggleRequest request,
      Authentication authentication) {
    return executionService.toggleChecklistItem(
        interventionId, itemId, request.isCompleted(), authentication.getName());
  }
}
