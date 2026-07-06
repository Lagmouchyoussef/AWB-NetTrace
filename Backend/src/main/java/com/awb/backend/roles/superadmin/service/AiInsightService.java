package com.awb.backend.roles.superadmin.service;

import com.awb.backend.ai.AiActionExecutor;
import com.awb.backend.ai.AiActionOutcome;
import com.awb.backend.core.dto.AiInsightResponse;
import com.awb.backend.core.entity.AiInsight;
import com.awb.backend.core.entity.AiInsightSeverity;
import com.awb.backend.core.entity.AiInsightStatus;
import com.awb.backend.core.entity.AiInsightType;
import com.awb.backend.core.repository.AiInsightRepository;
import com.awb.backend.core.repository.AiInsightSpecifications;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AiInsightService {

  private final AiInsightRepository aiInsightRepository;
  private final AiActionExecutor aiActionExecutor;

  public AiInsightService(AiInsightRepository aiInsightRepository, AiActionExecutor aiActionExecutor) {
    this.aiInsightRepository = aiInsightRepository;
    this.aiActionExecutor = aiActionExecutor;
  }

  @Transactional(readOnly = true)
  public Page<AiInsightResponse> list(
      String search, AiInsightStatus status, AiInsightSeverity severity, AiInsightType type, Pageable pageable) {
    Specification<AiInsight> spec =
        Specification.where(AiInsightSpecifications.notDeleted())
            .and(AiInsightSpecifications.search(search))
            .and(AiInsightSpecifications.hasStatus(status))
            .and(AiInsightSpecifications.hasSeverity(severity))
            .and(AiInsightSpecifications.hasType(type));
    return aiInsightRepository.findAll(spec, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public AiInsightResponse getById(Long id) {
    return toResponse(findActiveOrThrow(id));
  }

  @Transactional
  public AiInsightResponse acknowledge(Long id, String note) {
    AiInsight insight = findActiveOrThrow(id);
    insight.setStatus(AiInsightStatus.ACKNOWLEDGED);
    applyNote(insight, note);
    insight.setUpdatedAt(Instant.now());
    return toResponse(aiInsightRepository.save(insight));
  }

  @Transactional
  public AiInsightResponse dismiss(Long id, String note) {
    AiInsight insight = findActiveOrThrow(id);
    insight.setStatus(AiInsightStatus.DISMISSED);
    applyNote(insight, note);
    insight.setUpdatedAt(Instant.now());
    return toResponse(aiInsightRepository.save(insight));
  }

  @Transactional
  public AiInsightResponse apply(Long id, String note, String actorUsername) {
    AiInsight insight = findActiveOrThrow(id);
    if (insight.getStatus() != AiInsightStatus.NEW && insight.getStatus() != AiInsightStatus.ACKNOWLEDGED) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only new or acknowledged insights can be applied.");
    }

    // Human-approval path: forceApply=true bypasses the autonomous-actions toggle, since a
    // human clicking "Apply" is supervised, not autonomous, by definition.
    AiActionOutcome outcome;
    if ("INTERVENTION".equalsIgnoreCase(String.valueOf(insight.getEntityType()))
        || insight.getEntityType() == null) {
      outcome =
          aiActionExecutor.createUrgentIntervention(
              insight.getEntityId(),
              insight.getTitle(),
              insight.getSummary(),
              actorUsername,
              true);
    } else {
      outcome =
          aiActionExecutor.setEntityStatus(
              insight.getEntityType(),
              insight.getEntityId(),
              "MAINTENANCE",
              insight.getRecommendedAction() == null ? insight.getSummary() : insight.getRecommendedAction(),
              actorUsername,
              true);
    }

    insight.setStatus(AiInsightStatus.APPLIED);
    insight.setActionDetails(outcome.getMessage());
    applyNote(insight, note);
    insight.setUpdatedAt(Instant.now());
    return toResponse(aiInsightRepository.save(insight));
  }

  private void applyNote(AiInsight insight, String note) {
    if (note != null && !note.isBlank()) {
      insight.setNotes(note);
    }
  }

  private AiInsight findActiveOrThrow(Long id) {
    AiInsight insight =
        aiInsightRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Insight not found."));
    if (insight.isDeleted()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Insight not found.");
    }
    return insight;
  }

  private AiInsightResponse toResponse(AiInsight insight) {
    AiInsightResponse response = new AiInsightResponse();
    response.setId(insight.getId());
    response.setInsightType(insight.getInsightType());
    response.setSource(insight.getSource());
    response.setSeverity(insight.getSeverity());
    response.setStatus(insight.getStatus());
    response.setEntityType(insight.getEntityType());
    response.setEntityId(insight.getEntityId());
    response.setEntityName(insight.getEntityName());
    response.setTitle(insight.getTitle());
    response.setSummary(insight.getSummary());
    response.setRecommendedAction(insight.getRecommendedAction());
    response.setConfidence(insight.getConfidence());
    response.setAutonomousActionTaken(insight.isAutonomousActionTaken());
    response.setActionDetails(insight.getActionDetails());
    response.setRelatedAnomalyId(insight.getRelatedAnomalyId());
    response.setResolvedAt(insight.getResolvedAt());
    response.setCreatedAt(insight.getCreatedAt());
    response.setUpdatedAt(insight.getUpdatedAt());
    return response;
  }
}
