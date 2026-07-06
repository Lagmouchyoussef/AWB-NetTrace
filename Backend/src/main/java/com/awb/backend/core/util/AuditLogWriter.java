package com.awb.backend.core.util;

import com.awb.backend.core.entity.AuditAction;
import com.awb.backend.core.entity.AuditLog;
import com.awb.backend.core.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

// Central place to write AuditLog entries. Called from request-bound services (IP address is
// captured from the current HTTP request) and from the @Scheduled predictive-analysis job, which
// has no request in scope, so ipAddress is simply null there.
@Component
public class AuditLogWriter {

  private final AuditLogRepository auditLogRepository;

  public AuditLogWriter(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  public void log(
      String actorUsername,
      AuditAction action,
      String entityType,
      String entityReference,
      String description) {
    AuditLog entry = new AuditLog();
    entry.setActorUsername(actorUsername);
    entry.setAction(action);
    entry.setEntityType(entityType);
    entry.setEntityReference(entityReference);
    entry.setDescription(description);
    entry.setIpAddress(currentRequestIpOrNull());
    Instant now = Instant.now();
    entry.setOccurredAt(now);
    entry.setCreatedAt(now);
    entry.setUpdatedAt(now);
    auditLogRepository.save(entry);
  }

  private String currentRequestIpOrNull() {
    if (!(RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs)) {
      return null;
    }
    HttpServletRequest request = attrs.getRequest();
    return request.getRemoteAddr();
  }
}
