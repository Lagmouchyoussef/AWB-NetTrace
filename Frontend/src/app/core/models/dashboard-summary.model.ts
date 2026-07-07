export interface InfraCounts {
  datacenters: number;
  rooms: number;
  racks: number;
  devices: number;
  datacentersActive: number;
  roomsActive: number;
  racksActive: number;
  devicesActive: number;
}

export interface InsightSummary {
  id: number;
  severity: string;
  status: string;
  title: string;
  createdAt: string;
}

export interface InterventionSummary {
  id: number;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface ActivityItem {
  id: number;
  actorUsername: string;
  action: string;
  entityType: string;
  description: string | null;
  occurredAt: string;
}

export interface LabeledCount {
  label: string;
  count: number;
}

export interface DashboardSummary {
  infra: InfraCounts;
  openAnomaliesCount: number;
  activeInterventionsCount: number;
  activityTodayCount: number;
  aiConfigured: boolean;
  recentInsights: InsightSummary[];
  recentInterventions: InterventionSummary[];
  recentActivity: ActivityItem[];
  activityTimeSeries: LabeledCount[];
  activityByEntityType: LabeledCount[];
  interventionsByPriority: LabeledCount[];
  anomaliesBySeverity: LabeledCount[];
}
