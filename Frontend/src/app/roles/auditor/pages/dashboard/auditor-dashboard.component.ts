import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { AuditAction } from '../../../super-admin/pages/audit-logs/audit-log.model';
import { AuditorAuditLogService } from '../../../../core/services/auditor-audit-log.service';
import { AuditorAnomalyDetectionService } from '../../../../core/services/auditor-anomaly-detection.service';
import { AuditorReportService } from '../../../../core/services/auditor-report.service';
import { AnomalySeverity } from '../../../super-admin/pages/anomaly-detections/anomaly-detection.model';

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

// KPIs and chart breakdowns are composed client-side from the same read-only endpoints the list
// screens use (no dedicated dashboard-summary endpoint) - each count is a size:1 request so only
// totalElements is paid for, matching the pattern the other roles' dashboards already use.
@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe, StatChartComponent],
  templateUrl: './auditor-dashboard.component.html',
  styleUrl: './auditor-dashboard.component.css',
})
export class AuditorDashboardComponent implements OnInit {
  private readonly auditLogService = inject(AuditorAuditLogService);
  private readonly anomalyDetectionService = inject(AuditorAnomalyDetectionService);
  private readonly reportService = inject(AuditorReportService);
  private readonly translateService = inject(TranslateService);

  protected readonly loading = signal(true);

  protected readonly totalAuditEvents = signal(0);
  protected readonly openAnomaliesCount = signal(0);
  protected readonly criticalAnomaliesCount = signal(0);
  protected readonly activeReportsCount = signal(0);

  protected readonly actionData = signal<ChartDatum[]>([]);
  protected readonly severityData = signal<ChartDatum[]>([]);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const actions: AuditAction[] = ['CREATE', 'UPDATE', 'DELETE', 'CONFIG_CHANGE'];
      const severities: AnomalySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

      const [
        totalAuditEvents,
        actionCounts,
        openAnomalies,
        criticalAnomalies,
        severityCounts,
        activeReports,
      ] = await Promise.all([
        this.auditLogService.list({ page: 0, size: 1 }),
        Promise.all(
          actions.map((action) => this.auditLogService.list({ page: 0, size: 1, action })),
        ),
        this.anomalyDetectionService.list({ page: 0, size: 1, status: 'OPEN' }),
        this.anomalyDetectionService.list({ page: 0, size: 1, severity: 'CRITICAL' }),
        Promise.all(
          severities.map((severity) =>
            this.anomalyDetectionService.list({ page: 0, size: 1, severity }),
          ),
        ),
        this.reportService.list({ page: 0, size: 1, status: 'ACTIVE' }),
      ]);

      this.totalAuditEvents.set(totalAuditEvents.totalElements);
      this.openAnomaliesCount.set(openAnomalies.totalElements);
      this.criticalAnomaliesCount.set(criticalAnomalies.totalElements);
      this.activeReportsCount.set(activeReports.totalElements);

      this.actionData.set(
        actions
          .map((action, i) => ({
            label: this.translateService.instant(`auditLogs.action.${action}`),
            count: actionCounts[i].totalElements,
            colorRole: ACTION_COLOR[action],
          }))
          .filter((datum) => datum.count > 0),
      );

      this.severityData.set(
        severities
          .map((severity, i) => ({
            label: this.translateService.instant(`anomalyDetections.severity.${severity}`),
            count: severityCounts[i].totalElements,
            colorRole: SEVERITY_COLOR[severity],
          }))
          .filter((datum) => datum.count > 0),
      );
    } finally {
      this.loading.set(false);
    }
  }
}
