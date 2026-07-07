import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StatChartComponent } from '../../../core/components/charts/stat-chart/stat-chart.component';
import { ChartDatum } from '../../../core/components/charts/chart-data.model';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardSummary } from '../../../core/models/dashboard-summary.model';

const PRIORITY_COLOR_ROLES: Record<string, string> = {
  CRITICAL: 'critical',
  HIGH: 'serious',
  MEDIUM: 'warning',
  LOW: 'good',
};

const SEVERITY_COLOR_ROLES: Record<string, string> = {
  CRITICAL: 'ordinal-5',
  HIGH: 'ordinal-4',
  MEDIUM: 'ordinal-3',
  LOW: 'ordinal-2',
  INFO: 'ordinal-1',
};

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [DatePipe, TranslatePipe, StatChartComponent],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css',
})
export class SuperAdminDashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly translateService = inject(TranslateService);

  protected readonly summary = toSignal(this.dashboardService.summary$, { initialValue: null });

  // The two time-scoped charts re-fetch on their own instead of the 30s poll, so the
  // date-range control feels immediate without fighting the background refresh.
  protected readonly daysRange = signal(14);
  private readonly rangedSummary = signal<DashboardSummary | null>(null);

  constructor() {
    effect((onCleanup) => {
      const days = this.daysRange();
      let cancelled = false;
      this.dashboardService.getSummary(days).then((result) => {
        if (!cancelled) {
          this.rangedSummary.set(result);
        }
      });
      onCleanup(() => {
        cancelled = true;
      });
    });
  }

  protected setDaysRange(days: number): void {
    this.daysRange.set(days);
  }

  protected readonly activityTrendData = computed<ChartDatum[]>(() =>
    (this.rangedSummary()?.activityTimeSeries ?? []).map((point) => ({
      label: point.label,
      count: point.count,
    })),
  );

  protected readonly activityByEntityTypeData = computed<ChartDatum[]>(() =>
    (this.rangedSummary()?.activityByEntityType ?? []).map((point) => ({
      label: point.label === 'OTHER' ? this.translateService.instant('dashboard.entityType.OTHER') : point.label,
      count: point.count,
    })),
  );

  protected readonly interventionsByPriorityData = computed<ChartDatum[]>(() =>
    (this.summary()?.interventionsByPriority ?? []).map((point) => ({
      label: this.priorityLabel(point.label),
      count: point.count,
      colorRole: PRIORITY_COLOR_ROLES[point.label],
    })),
  );

  protected readonly anomaliesBySeverityData = computed<ChartDatum[]>(() =>
    (this.summary()?.anomaliesBySeverity ?? []).map((point) => ({
      label: this.severityLabel(point.label),
      count: point.count,
      colorRole: SEVERITY_COLOR_ROLES[point.label],
    })),
  );

  protected readonly infraHealthData = computed<ChartDatum[]>(() => {
    const infra = this.summary()?.infra;
    if (!infra) {
      return [];
    }
    return [
      { label: this.translateService.instant('dashboard.stats.datacenters'), count: infra.datacentersActive, colorRole: 'good' },
      { label: this.translateService.instant('dashboard.stats.rooms'), count: infra.roomsActive, colorRole: 'good' },
      { label: this.translateService.instant('dashboard.stats.racks'), count: infra.racksActive, colorRole: 'good' },
      { label: this.translateService.instant('dashboard.stats.devices'), count: infra.devicesActive, colorRole: 'good' },
    ];
  });

  protected severityLabel(severity: string): string {
    return this.translateService.instant(`aiInsights.severity.${severity}`);
  }

  protected priorityLabel(priority: string): string {
    return this.translateService.instant(`interventions.priority.${priority}`);
  }

  protected actionLabel(action: string): string {
    return this.translateService.instant(`dashboard.activityActions.${action}`);
  }
}
