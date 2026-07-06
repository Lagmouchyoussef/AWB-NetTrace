package com.awb.backend.roles.superadmin.service;

import com.awb.backend.ai.AnthropicGateway;
import com.awb.backend.core.dto.DashboardSummaryResponse;
import com.awb.backend.core.entity.AnomalyDetectionStatus;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.DatacenterStatus;
import com.awb.backend.core.entity.Device;
import com.awb.backend.core.entity.DeviceStatus;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Plain cross-repository aggregate read for the rebuilt dashboard - not AI-specific, hence
// living in the normal service package rather than the ai/ package.
@Service
public class DashboardService {

  private static final int RECENT_ITEMS_LIMIT = 5;

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
  public DashboardSummaryResponse getSummary() {
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
    response.setAiConfigured(anthropicGateway.isConfigured());
    response.setRecentInsights(
        aiInsightRepository
            .findAll(PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "createdAt")))
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
            .findAll(PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "createdAt")))
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
            .findAll(PageRequest.of(0, RECENT_ITEMS_LIMIT, Sort.by(Sort.Direction.DESC, "occurredAt")))
            .map(
                entry -> {
                  DashboardSummaryResponse.ActivityItem item = new DashboardSummaryResponse.ActivityItem();
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
    java.util.List<Room> rooms = roomRepository.findAll().stream().filter(r -> !r.isDeleted()).toList();
    java.util.List<Rack> racks = rackRepository.findAll().stream().filter(r -> !r.isDeleted()).toList();
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
    counts.setDevicesActive(devices.stream().filter(d -> d.getStatus() == DeviceStatus.ACTIVE).count());
    return counts;
  }
}
