package com.awb.backend.roles.superadmin.service;

import com.awb.backend.ai.AnthropicGateway;
import com.awb.backend.core.dto.DashboardSummaryResponse;
import com.awb.backend.core.dto.DashboardSummaryResponse.LabeledCount;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.AnomalySeverity;
import com.awb.backend.core.entity.AuditLog;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
import com.awb.backend.core.entity.InterventionPriority;
import com.awb.backend.core.entity.InterventionStatus;
import com.awb.backend.core.entity.Rack;
import com.awb.backend.core.entity.RackStatus;
import com.awb.backend.core.entity.Room;
import com.awb.backend.core.entity.RoomStatus;
import com.awb.backend.core.repository.AiInsightRepository;
import com.awb.backend.core.repository.AnomalyDetectionRepository;
import com.awb.backend.core.repository.AuditLogRepository;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.DeviceRepository;
import com.awb.backend.core.repository.InterventionRepository;
import com.awb.backend.core.repository.RackRepository;
import com.awb.backend.core.repository.RoomRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Plain cross-repository aggregate read for the rebuilt dashboard - not AI-specific, hence
// living in the normal service package rather than the ai/ package.
@Service
public class DashboardService {

  private static final int RECENT_ITEMS_LIMIT = 5;
  private static final int DEFAULT_ACTIVITY_DAYS = 14;

  private final DatacenterRepository datacenterRepository;
  private final RoomRepository roomRepository;
  private final RackRepository rackRepository;
  private final DeviceRepository deviceRepository;
  private final AnomalyDetectionRepository anomalyDetectionRepository;
  private final InterventionRepository interventionRepository;
  private final AiInsightRepository aiInsightRepository;
  private final AuditLogRepository auditLogRepository;
  private final AnthropicGateway anthropicGateway;

  public DashboardService(
      DatacenterRepository datacenterRepository,
      RoomRepository roomRepository,
      RackRepository rackRepository,
      DeviceRepository deviceRepository,
      AnomalyDetectionRepository anomalyDetectionRepository,
      InterventionRepository interventionRepository,
      AiInsightRepository aiInsightRepository,
      AuditLogRepository auditLogRepository,
      AnthropicGateway anthropicGateway) {
    this.datacenterRepository = datacenterRepository;
    this.roomRepository = roomRepository;
    this.rackRepository = rackRepository;
    this.deviceRepository = deviceRepository;
    this.anomalyDetectionRepository = anomalyDetectionRepository;
    this.interventionRepository = interventionRepository;
    this.aiInsightRepository = aiInsightRepository;
    this.auditLogRepository = auditLogRepository;
    this.anthropicGateway = anthropicGateway;
  }

  @Transactional(readOnly = true)
  public DashboardSummaryResponse getSummary(int days) {
    int effectiveDays = days > 0 ? days : DEFAULT_ACTIVITY_DAYS;
    Instant since = Instant.now().minus(java.time.Duration.ofDays(effectiveDays));

    DashboardSummaryResponse response = new DashboardSummaryResponse();
    response.setInfra(buildInfraCounts());
    response.setOpenAnomaliesCount(
        anomalyDetectionRepository.findAll().stream()
            .filter(a -> !a.isDeleted() && a.getStatus() == AnomalyDetectionStatus.OPEN)
            .count());
    response.setActiveInterventionsCount(
        interventionRepository.findAll().stream()
            .filter(
                i ->
                    !i.isDeleted()
                        && (i.getStatus() == InterventionStatus.SCHEDULED
                            || i.getStatus() == InterventionStatus.IN_PROGRESS))
            .count());
    response.setActivityTodayCount(
        auditLogRepository.findAll().stream()
            .filter(
                a ->
                    a.getOccurredAt()
                        .isAfter(Instant.now().truncatedTo(java.time.temporal.ChronoUnit.DAYS)))
            .count());
    response.setAiConfigured(anthropicGateway.isConfigured());
    response.setActivityTimeSeries(buildActivityTimeSeries(since, effectiveDays));
    response.setActivityByEntityType(buildActivityByEntityType(since));
    response.setInterventionsByPriority(buildInterventionsByPriority());
    response.setAnomaliesBySeverity(buildAnomaliesBySeverity());
    response.setRecentInsights(
        aiInsightRepository
            .findAll(
                PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "createdAt")))
            .map(
                insight -> {
                  DashboardSummaryResponse.InsightSummary summary =
                      new DashboardSummaryResponse.InsightSummary();
                  summary.setId(insight.getId());
                  summary.setSeverity(insight.getSeverity().name());
                  summary.setStatus(insight.getStatus().name());
                  summary.setTitle(insight.getTitle());
                  summary.setCreatedAt(insight.getCreatedAt());
                  return summary;
                })
            .getContent());
    response.setRecentInterventions(
        interventionRepository
            .findAll(
                PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "createdAt")))
            .map(
                intervention -> {
                  DashboardSummaryResponse.InterventionSummary summary =
                      new DashboardSummaryResponse.InterventionSummary();
                  summary.setId(intervention.getId());
                  summary.setTitle(intervention.getTitle());
                  summary.setPriority(intervention.getPriority().name());
                  summary.setStatus(intervention.getStatus().name());
                  summary.setCreatedAt(intervention.getCreatedAt());
                  return summary;
                })
            .getContent());
    response.setRecentActivity(
        auditLogRepository
            .findAll(
                PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "occurredAt")))
            .map(
                entry -> {
                  DashboardSummaryResponse.ActivityItem item =
                      new DashboardSummaryResponse.ActivityItem();
                  item.setId(entry.getId());
                  item.setActorUsername(entry.getActorUsername());
                  item.setAction(entry.getAction().name());
                  item.setEntityType(entry.getEntityType());
                  item.setDescription(entry.getDescription());
                  item.setOccurredAt(entry.getOccurredAt());
                  return item;
                })
            .getContent());
    return response;
  }

  private DashboardSummaryResponse.InfraCounts buildInfraCounts() {
    DashboardSummaryResponse.InfraCounts counts = new DashboardSummaryResponse.InfraCounts();
    java.util.List<Datacenter> datacenters =
        datacenterRepository.findAll().stream().filter(d -> !d.isDeleted()).toList();
    java.util.List<Room> rooms =
        roomRepository.findAll().stream().filter(r -> !r.isDeleted()).toList();
    java.util.List<Rack> racks =
        rackRepository.findAll().stream().filter(r -> !r.isDeleted()).toList();
    java.util.List<Device> devices =
        deviceRepository.findAll().stream().filter(d -> !d.isDeleted()).toList();

    counts.setDatacenters(datacenters.size());
    counts.setRooms(rooms.size());
    counts.setRacks(racks.size());
    counts.setDevices(devices.size());
    counts.setDatacentersActive(
        datacenters.stream().filter(d -> d.getStatus() == DatacenterStatus.ACTIVE).count());
    counts.setRoomsActive(rooms.stream().filter(r -> r.getStatus() == RoomStatus.ACTIVE).count());
    counts.setRacksActive(racks.stream().filter(r -> r.getStatus() == RackStatus.ACTIVE).count());
    counts.setDevicesActive(
        devices.stream().filter(d -> d.getStatus() == DeviceStatus.ACTIVE).count());
    return counts;
  }

  private List<LabeledCount> buildActivityTimeSeries(Instant since, int days) {
    DateTimeFormatter dayFormat = DateTimeFormatter.ISO_LOCAL_DATE;
    Map<LocalDate, Long> countsByDay =
        auditLogRepository.findAll().stream()
            .filter(a -> a.getOccurredAt().isAfter(since))
            .collect(
                Collectors.groupingBy(
                    a -> a.getOccurredAt().atZone(ZoneOffset.UTC).toLocalDate(),
                    Collectors.counting()));

    LocalDate today = Instant.now().atZone(ZoneOffset.UTC).toLocalDate();
    List<LabeledCount> series = new ArrayList<>();
    for (int i = days - 1; i >= 0; i--) {
      LocalDate day = today.minusDays(i);
      series.add(new LabeledCount(dayFormat.format(day), countsByDay.getOrDefault(day, 0L)));
    }
    return series;
  }

  private static final int ENTITY_TYPE_TOP_N = 7;
  private static final String OTHER_LABEL = "OTHER";

  private List<LabeledCount> buildActivityByEntityType(Instant since) {
    Map<String, Long> countsByType =
        auditLogRepository.findAll().stream()
            .filter(a -> a.getOccurredAt().isAfter(since))
            .collect(Collectors.groupingBy(AuditLog::getEntityType, Collectors.counting()));

    List<Map.Entry<String, Long>> sorted =
        countsByType.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .toList();

    List<LabeledCount> result = new ArrayList<>();
    long otherTotal = 0;
    for (int i = 0; i < sorted.size(); i++) {
      if (i < ENTITY_TYPE_TOP_N) {
        result.add(new LabeledCount(sorted.get(i).getKey(), sorted.get(i).getValue()));
      } else {
        otherTotal += sorted.get(i).getValue();
      }
    }
    if (otherTotal > 0) {
      result.add(new LabeledCount(OTHER_LABEL, otherTotal));
    }
    return result;
  }

  private List<LabeledCount> buildInterventionsByPriority() {
    Map<InterventionPriority, Long> countsByPriority =
        interventionRepository.findAll().stream()
            .filter(i -> !i.isDeleted())
            .collect(Collectors.groupingBy(i -> i.getPriority(), Collectors.counting()));

    Map<InterventionPriority, String> order = new LinkedHashMap<>();
    order.put(InterventionPriority.CRITICAL, null);
    order.put(InterventionPriority.HIGH, null);
    order.put(InterventionPriority.MEDIUM, null);
    order.put(InterventionPriority.LOW, null);

    return order.keySet().stream()
        .map(p -> new LabeledCount(p.name(), countsByPriority.getOrDefault(p, 0L)))
        .toList();
  }

  private List<LabeledCount> buildAnomaliesBySeverity() {
    Map<AnomalySeverity, Long> countsBySeverity =
        anomalyDetectionRepository.findAll().stream()
            .filter(a -> !a.isDeleted())
            .collect(Collectors.groupingBy(a -> a.getSeverity(), Collectors.counting()));

    List<AnomalySeverity> order =
        List.of(
            AnomalySeverity.CRITICAL,
            AnomalySeverity.HIGH,
            AnomalySeverity.MEDIUM,
            AnomalySeverity.LOW,
            AnomalySeverity.INFO);

    return order.stream()
        .map(s -> new LabeledCount(s.name(), countsBySeverity.getOrDefault(s, 0L)))
        .toList();
  }
}
