package com.awb.backend.core.dto;

import java.time.Instant;
import java.util.List;

public class DashboardSummaryResponse {

  private InfraCounts infra;
  private long openAnomaliesCount;
  private long activeInterventionsCount;
  private long activityTodayCount;
  private boolean aiConfigured;
  private List<InsightSummary> recentInsights;
  private List<InterventionSummary> recentInterventions;
  private List<ActivityItem> recentActivity;
  private List<LabeledCount> activityTimeSeries;
  private List<LabeledCount> activityByEntityType;
  private List<LabeledCount> interventionsByPriority;
  private List<LabeledCount> anomaliesBySeverity;

  public InfraCounts getInfra() {
    return infra;
  }

  public void setInfra(InfraCounts infra) {
    this.infra = infra;
  }

  public long getOpenAnomaliesCount() {
    return openAnomaliesCount;
  }

  public void setOpenAnomaliesCount(long openAnomaliesCount) {
    this.openAnomaliesCount = openAnomaliesCount;
  }

  public long getActiveInterventionsCount() {
    return activeInterventionsCount;
  }

  public void setActiveInterventionsCount(long activeInterventionsCount) {
    this.activeInterventionsCount = activeInterventionsCount;
  }

  public boolean isAiConfigured() {
    return aiConfigured;
  }

  public void setAiConfigured(boolean aiConfigured) {
    this.aiConfigured = aiConfigured;
  }

  public List<InsightSummary> getRecentInsights() {
    return recentInsights;
  }

  public void setRecentInsights(List<InsightSummary> recentInsights) {
    this.recentInsights = recentInsights;
  }

  public List<InterventionSummary> getRecentInterventions() {
    return recentInterventions;
  }

  public void setRecentInterventions(List<InterventionSummary> recentInterventions) {
    this.recentInterventions = recentInterventions;
  }

  public List<ActivityItem> getRecentActivity() {
    return recentActivity;
  }

  public void setRecentActivity(List<ActivityItem> recentActivity) {
    this.recentActivity = recentActivity;
  }

  public long getActivityTodayCount() {
    return activityTodayCount;
  }

  public void setActivityTodayCount(long activityTodayCount) {
    this.activityTodayCount = activityTodayCount;
  }

  public List<LabeledCount> getActivityTimeSeries() {
    return activityTimeSeries;
  }

  public void setActivityTimeSeries(List<LabeledCount> activityTimeSeries) {
    this.activityTimeSeries = activityTimeSeries;
  }

  public List<LabeledCount> getActivityByEntityType() {
    return activityByEntityType;
  }

  public void setActivityByEntityType(List<LabeledCount> activityByEntityType) {
    this.activityByEntityType = activityByEntityType;
  }

  public List<LabeledCount> getInterventionsByPriority() {
    return interventionsByPriority;
  }

  public void setInterventionsByPriority(List<LabeledCount> interventionsByPriority) {
    this.interventionsByPriority = interventionsByPriority;
  }

  public List<LabeledCount> getAnomaliesBySeverity() {
    return anomaliesBySeverity;
  }

  public void setAnomaliesBySeverity(List<LabeledCount> anomaliesBySeverity) {
    this.anomaliesBySeverity = anomaliesBySeverity;
  }

  public static class LabeledCount {
    private String label;
    private long count;

    public LabeledCount() {}

    public LabeledCount(String label, long count) {
      this.label = label;
      this.count = count;
    }

    public String getLabel() {
      return label;
    }

    public void setLabel(String label) {
      this.label = label;
    }

    public long getCount() {
      return count;
    }

    public void setCount(long count) {
      this.count = count;
    }
  }

  public static class InfraCounts {
    private long datacenters;
    private long rooms;
    private long racks;
    private long devices;
    private long datacentersActive;
    private long roomsActive;
    private long racksActive;
    private long devicesActive;

    public long getDatacenters() {
      return datacenters;
    }

    public void setDatacenters(long datacenters) {
      this.datacenters = datacenters;
    }

    public long getRooms() {
      return rooms;
    }

    public void setRooms(long rooms) {
      this.rooms = rooms;
    }

    public long getRacks() {
      return racks;
    }

    public void setRacks(long racks) {
      this.racks = racks;
    }

    public long getDevices() {
      return devices;
    }

    public void setDevices(long devices) {
      this.devices = devices;
    }

    public long getDatacentersActive() {
      return datacentersActive;
    }

    public void setDatacentersActive(long datacentersActive) {
      this.datacentersActive = datacentersActive;
    }

    public long getRoomsActive() {
      return roomsActive;
    }

    public void setRoomsActive(long roomsActive) {
      this.roomsActive = roomsActive;
    }

    public long getRacksActive() {
      return racksActive;
    }

    public void setRacksActive(long racksActive) {
      this.racksActive = racksActive;
    }

    public long getDevicesActive() {
      return devicesActive;
    }

    public void setDevicesActive(long devicesActive) {
      this.devicesActive = devicesActive;
    }
  }

  public static class InsightSummary {
    private Long id;
    private String severity;
    private String status;
    private String title;
    private Instant createdAt;

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getSeverity() {
      return severity;
    }

    public void setSeverity(String severity) {
      this.severity = severity;
    }

    public String getStatus() {
      return status;
    }

    public void setStatus(String status) {
      this.status = status;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public Instant getCreatedAt() {
      return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
      this.createdAt = createdAt;
    }
  }

  public static class InterventionSummary {
    private Long id;
    private String title;
    private String priority;
    private String status;
    private Instant createdAt;

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }

    public String getPriority() {
      return priority;
    }

    public void setPriority(String priority) {
      this.priority = priority;
    }

    public String getStatus() {
      return status;
    }

    public void setStatus(String status) {
      this.status = status;
    }

    public Instant getCreatedAt() {
      return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
      this.createdAt = createdAt;
    }
  }

  public static class ActivityItem {
    private Long id;
    private String actorUsername;
    private String action;
    private String entityType;
    private String description;
    private Instant occurredAt;

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getActorUsername() {
      return actorUsername;
    }

    public void setActorUsername(String actorUsername) {
      this.actorUsername = actorUsername;
    }

    public String getAction() {
      return action;
    }

    public void setAction(String action) {
      this.action = action;
    }

    public String getEntityType() {
      return entityType;
    }

    public void setEntityType(String entityType) {
      this.entityType = entityType;
    }

    public String getDescription() {
      return description;
    }

    public void setDescription(String description) {
      this.description = description;
    }

    public Instant getOccurredAt() {
      return occurredAt;
    }

    public void setOccurredAt(Instant occurredAt) {
      this.occurredAt = occurredAt;
    }
  }
}
