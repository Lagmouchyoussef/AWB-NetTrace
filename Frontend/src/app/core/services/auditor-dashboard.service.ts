import { Injectable, inject } from '@angular/core';
import { Observable, Subject, from, interval, merge, shareReplay, startWith, switchMap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../components/charts/chart-data.model';
import { AuditorAuditLogService } from './auditor-audit-log.service';
import { AuditorAnomalyDetectionService } from './auditor-anomaly-detection.service';
import { AuditorReportService } from './auditor-report.service';
import { AuditAction } from '../../roles/super-admin/pages/audit-logs/audit-log.model';
import { AnomalySeverity } from '../../roles/super-admin/pages/anomaly-detections/anomaly-detection.model';

const POLL_INTERVAL_MS = 30000;

const ACTIONS: AuditAction[] = ['CREATE', 'UPDATE', 'DELETE', 'CONFIG_CHANGE'];
const SEVERITIES: AnomalySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

const ACTION_COLOR: Record<AuditAction, string> = {
  CREATE: 'good',
  UPDATE: 'series-1',
  DELETE: 'critical',
  CONFIG_CHANGE: 'serious',
  LOGIN: 'ordinal-1',
  LOGOUT: 'ordinal-2',
  EXPORT: 'ordinal-3',
};

const SEVERITY_COLOR: Record<AnomalySeverity, string> = {
  CRITICAL: 'critical',
  HIGH: 'serious',
  MEDIUM: 'warning',
  LOW: 'good',
  INFO: 'ordinal-1',
};

export interface AuditorDashboardSummary {
  totalAuditEvents: number;
  openAnomaliesCount: number;
  criticalAnomaliesCount: number;
  activeReportsCount: number;
  actionData: ChartDatum[];
  severityData: ChartDatum[];
}

// Same live-refresh shape as ApproverDashboardService/RequesterDashboardService (30s poll +
// instant triggerRefresh() from NotificationService on any relevant SSE event) - here wrapping
// the existing client-side, multi-endpoint aggregation this dashboard already composed inline
// (no dedicated backend summary endpoint), so the Dashboard screen now reacts the moment anyone
// anywhere logs an auditable action, instead of only on manual page load.
@Injectable({ providedIn: 'root' })
export class AuditorDashboardService {
  private readonly auditLogService = inject(AuditorAuditLogService);
  private readonly anomalyDetectionService = inject(AuditorAnomalyDetectionService);
  private readonly reportService = inject(AuditorReportService);
  private readonly translateService = inject(TranslateService);

  private readonly manualRefresh$ = new Subject<void>();

  readonly summary$: Observable<AuditorDashboardSummary> = merge(
    interval(POLL_INTERVAL_MS).pipe(startWith(0)),
    this.manualRefresh$,
  ).pipe(
    switchMap(() => from(this.fetchSummary())),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  triggerRefresh(): void {
    this.manualRefresh$.next();
  }

  private async fetchSummary(): Promise<AuditorDashboardSummary> {
    const [
      totalAuditEvents,
      actionCounts,
      openAnomalies,
      criticalAnomalies,
      severityCounts,
      activeReports,
    ] = await Promise.all([
      this.auditLogService.list({ page: 0, size: 1 }),
      Promise.all(ACTIONS.map((action) => this.auditLogService.list({ page: 0, size: 1, action }))),
      this.anomalyDetectionService.list({ page: 0, size: 1, status: 'OPEN' }),
      this.anomalyDetectionService.list({ page: 0, size: 1, severity: 'CRITICAL' }),
      Promise.all(
        SEVERITIES.map((severity) =>
          this.anomalyDetectionService.list({ page: 0, size: 1, severity }),
        ),
      ),
      this.reportService.list({ page: 0, size: 1, status: 'ACTIVE' }),
    ]);

    return {
      totalAuditEvents: totalAuditEvents.totalElements,
      openAnomaliesCount: openAnomalies.totalElements,
      criticalAnomaliesCount: criticalAnomalies.totalElements,
      activeReportsCount: activeReports.totalElements,
      actionData: ACTIONS.map((action, i) => ({
        label: this.translateService.instant(`auditLogs.action.${action}`),
        count: actionCounts[i].totalElements,
        colorRole: ACTION_COLOR[action],
      })).filter((datum) => datum.count > 0),
      severityData: SEVERITIES.map((severity, i) => ({
        label: this.translateService.instant(`anomalyDetections.severity.${severity}`),
        count: severityCounts[i].totalElements,
        colorRole: SEVERITY_COLOR[severity],
      })).filter((datum) => datum.count > 0),
    };
  }
}
