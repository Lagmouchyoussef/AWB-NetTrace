package com.awb.backend.roles.superadmin.controller;

import com.awb.backend.core.dto.AiInsightActionRequest;
import com.awb.backend.core.dto.AiInsightResponse;
import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import com.awb.backend.roles.superadmin.service.AiInsightService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles/super-admin/ai/insights")
public class AiInsightController {

  private final AiInsightService aiInsightService;

  public AiInsightController(AiInsightService aiInsightService) {
    this.aiInsightService = aiInsightService;
  }

  @GetMapping
  public Page<AiInsightResponse> list(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) AiInsightStatus status,
      @RequestParam(required = false) AiInsightSeverity severity,
      @RequestParam(required = false) AiInsightType type,
      Pageable pageable) {
    return aiInsightService.list(search, status, severity, type, pageable);
  }

  @GetMapping("/{id}")
  public AiInsightResponse getById(@PathVariable Long id) {
    return aiInsightService.getById(id);
  }

  @PatchMapping("/{id}/acknowledge")
  public AiInsightResponse acknowledge(
      @PathVariable Long id, @Valid @RequestBody AiInsightActionRequest request) {
    return aiInsightService.acknowledge(id, request.getNote());
  }

  @PatchMapping("/{id}/dismiss")
  public AiInsightResponse dismiss(
      @PathVariable Long id, @Valid @RequestBody AiInsightActionRequest request) {
    return aiInsightService.dismiss(id, request.getNote());
  }

  @PatchMapping("/{id}/apply")
  public AiInsightResponse apply(
      @PathVariable Long id,
      @Valid @RequestBody AiInsightActionRequest request,
      Principal principal) {
    return aiInsightService.apply(id, request.getNote(), principal.getName());
  }
}
