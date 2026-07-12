import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../core/components/charts/stat-chart/stat-chart.component';
import { ApproverDashboardService } from '../../../core/services/approver-dashboard.service';
import {
  Intervention,
  InterventionPriority,
} from '../../super-admin/pages/interventions/intervention.model';

const URGENT_PRIORITIES = new Set<InterventionPriority>(['CRITICAL', 'HIGH']);

// Same local color-role map convention every dashboard in this app defines for itself (see
// super-admin/dc-admin dashboards' PRIORITY_COLOR_ROLES, technician home's STATUS/TYPE maps).
const PRIORITY_COLOR_ROLES: Record<string, string> = {
  CRITICAL: 'critical',
  HIGH: 'serious',
  MEDIUM: 'warning',
  LOW: 'good',
};

const TYPE_COLOR_ROLES: Record<string, string> = {
  INCIDENT_RESPONSE: 'critical',
  CORRECTIVE_MAINTENANCE: 'serious',
  PREVENTIVE_MAINTENANCE: 'good',
  INSPECTION: 'warning',
  INSTALLATION: 'series-1',
  DECOMMISSIONING: 'ordinal-1',
};

// Deliberately not a clone of DC Admin/Super Admin's dashboard (infra health, anomalies, activity
// feed) - Approver has no infrastructure to monitor. Everything here is derived client-side from
// the shared live approval-queue stream (ApproverDashboardService) - same data, same 30s-poll +
// notification-triggered refresh the other dashboards use, so this screen and the Approval Queue
// screen always agree and update together without a manual reload.
@Component({
  selector: 'app-approver-dashboard',
  standalone: true,
  imports: [TranslatePipe, StatChartComponent, RouterLink],
  templateUrl: './approver-dashboard.component.html',
  styleUrl: './approver-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverDashboardComponent {
  private readonly dashboardService = inject(ApproverDashboardService);
  private readonly translateService = inject(TranslateService);

  private readonly queue = toSignal(this.dashboardService.queue$, { initialValue: null });

  protected readonly loading = computed(() => this.queue() === null);
  protected readonly pending = computed<Intervention[]>(() => this.queue()?.content ?? []);
  protected readonly totalPending = computed(() => this.queue()?.totalElements ?? 0);

  protected readonly urgentCount = computed(
    () => this.pending().filter((i) => URGENT_PRIORITIES.has(i.priority)).length,
  );

  protected readonly dueThisWeekCount = computed(() => {
    const cutoff = Date.now() + 7 * 24 * 60 * 60 * 1000;
    return this.pending().filter((i) => new Date(i.scheduledAt).getTime() <= cutoff).length;
  });

  protected readonly oldestPendingDays = computed(() => {
    const items = this.pending();
    if (items.length === 0) {
      return 0;
    }
    const oldestCreatedAt = Math.min(...items.map((i) => new Date(i.createdAt).getTime()));
    return Math.floor((Date.now() - oldestCreatedAt) / (1000 * 60 * 60 * 24));
  });

  // Sorted by priority then longest-waiting first - the same triage order the Approval Queue
  // itself doesn't currently enforce, so this preview surfaces "what needs attention first"
  // without navigating away.
  protected readonly topPriorityRequests = computed<Intervention[]>(() => {
    const rank: Record<InterventionPriority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return [...this.pending()]
      .sort((a, b) => {
        const priorityDelta = rank[a.priority] - rank[b.priority];
        if (priorityDelta !== 0) {
          return priorityDelta;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .slice(0, 5);
  });

  protected readonly priorityBreakdownData = computed<ChartDatum[]>(() =>
    this.groupBy(
      this.pending(),
      (i) => i.priority,
      (priority) => this.translateService.instant(`interventions.priority.${priority}`),
      PRIORITY_COLOR_ROLES,
    ),
  );

  protected readonly typeBreakdownData = computed<ChartDatum[]>(() =>
    this.groupBy(
      this.pending(),
      (i) => i.interventionType,
      (type) => this.translateService.instant(`interventions.interventionType.${type}`),
      TYPE_COLOR_ROLES,
    ),
  );

  protected waitingDays(item: Intervention): number {
    return Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  }

  private groupBy<K extends string>(
    items: Intervention[],
    keyOf: (item: Intervention) => K,
    labelOf: (key: K) => string,
    colorRoles: Record<string, string>,
  ): ChartDatum[] {
    const counts = new Map<K, number>();
    for (const item of items) {
      const key = keyOf(item);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([key, count]) => ({
      label: labelOf(key),
      count,
      colorRole: colorRoles[key],
    }));
  }
}
