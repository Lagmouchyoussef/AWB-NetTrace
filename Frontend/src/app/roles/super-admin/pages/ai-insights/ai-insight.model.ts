export type AiInsightType = 'RISK_PREDICTION' | 'RECOMMENDATION' | 'AUTONOMOUS_ACTION';

export type AiInsightSource = 'SCHEDULED_JOB' | 'CHAT_ASSISTANT';

export type AiInsightSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AiInsightStatus = 'NEW' | 'ACKNOWLEDGED' | 'APPLIED' | 'DISMISSED';

export const AI_INSIGHT_STATUSES: AiInsightStatus[] = [
  'NEW',
  'ACKNOWLEDGED',
  'APPLIED',
  'DISMISSED',
];

export const AI_INSIGHT_SEVERITIES: AiInsightSeverity[] = [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
  'INFO',
];

export interface AiInsight {
  id: number;
  insightType: AiInsightType;
  source: AiInsightSource;
  severity: AiInsightSeverity;
  status: AiInsightStatus;
  entityType: string | null;
  entityId: number | null;
  entityName: string | null;
  title: string;
  summary: string;
  recommendedAction: string | null;
  confidence: number | null;
  autonomousActionTaken: boolean;
  actionDetails: string | null;
  relatedAnomalyId: number | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiInsightActionRequest {
  note?: string | null;
}

export interface AiInsightPage {
  content: AiInsight[];
  totalElements: number;
}

export interface AiInsightListParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  status?: AiInsightStatus;
  severity?: AiInsightSeverity;
}
