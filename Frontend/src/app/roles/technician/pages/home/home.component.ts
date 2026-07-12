import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { AuthService } from '../../../../core/services/auth.service';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import {
  Intervention,
  InterventionPriority,
} from '../../../super-admin/pages/interventions/intervention.model';
import { InterventionCardComponent } from '../../components/intervention-card/intervention-card.component';

const URGENT_PRIORITIES = new Set<InterventionPriority>(['CRITICAL', 'HIGH']);

const PRIORITY_RANK: Record<InterventionPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

// Home shows actionable work (scheduled/in progress/on hold) as the primary list, not the full
// history - completed and cancelled interventions live in the "My Interventions" list instead.
// Demo seed timestamps are relative offsets from first boot, not literal "today", so filtering on
// status rather than calendar date keeps this screen meaningful regardless of when the app was
// last seeded. The dashboard charts below use the full fetched window instead, since a status/
// priority/type breakdown needs the whole picture, not just what's still actionable.
const ACTIONABLE_STATUSES = new Set(['SCHEDULED', 'IN_PROGRESS', 'ON_HOLD']);

// Same intent as interventionTypeColor()/TYPE_COLOR in core/utils/intervention-type-icons.ts, but
// expressed as bare chart color-role suffixes (ChartDatum.colorRole resolves to var(--chart-<role>))
// rather than full var(...) strings - kept local like every other role dashboard's color maps
// (see super-admin-dashboard.component.ts's PRIORITY_COLOR_ROLES/SEVERITY_COLOR_ROLES).
const STATUS_COLOR_ROLES: Record<string, string> = {
  SCHEDULED: 'series-1',
  IN_PROGRESS: 'warning',
  ON_HOLD: 'ordinal-1',
  COMPLETED: 'good',
  CANCELLED: 'critical',
};

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

@Component({
  selector: 'app-technician-home',
  standalone: true,
  imports: [TranslatePipe, InterventionCardComponent, StatChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianHomeComponent implements OnInit {
  private readonly interventionService = inject(TechnicianInterventionService);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);

  protected readonly loading = signal(true);
  protected readonly allInterventions = signal<Intervention[]>([]);

  protected readonly username = computed(() => this.authService.username() ?? '');

  protected readonly actionableList = computed(() =>
    this.allInterventions()
      .filter((i) => ACTIONABLE_STATUSES.has(i.status))
      .sort((a, b) => {
        const priorityDelta = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        if (priorityDelta !== 0) {
          return priorityDelta;
        }
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      }),
  );

  protected readonly totalCount = computed(() => this.actionableList().length);
  protected readonly urgentCount = computed(
    () => this.actionableList().filter((i) => URGENT_PRIORITIES.has(i.priority)).length,
  );
  protected readonly inProgressCount = computed(
    () => this.actionableList().filter((i) => i.status === 'IN_PROGRESS').length,
  );
  protected readonly completedCount = computed(
    () => this.allInterventions().filter((i) => i.status === 'COMPLETED').length,
  );

  protected readonly statusBreakdownData = computed<ChartDatum[]>(() =>
    this.groupBy(
      this.allInterventions(),
      (i) => i.status,
      (status) => this.translateService.instant(`interventions.status.${status}`),
      STATUS_COLOR_ROLES,
    ),
  );

  protected readonly priorityBreakdownData = computed<ChartDatum[]>(() =>
    this.groupBy(
      this.allInterventions(),
      (i) => i.priority,
      (priority) => this.translateService.instant(`interventions.priority.${priority}`),
      PRIORITY_COLOR_ROLES,
    ),
  );

  protected readonly typeBreakdownData = computed<ChartDatum[]>(() =>
    this.groupBy(
      this.allInterventions(),
      (i) => i.interventionType,
      (type) => this.translateService.instant(`interventions.interventionType.${type}`),
      TYPE_COLOR_ROLES,
    ),
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({
        page: 0,
        size: 200,
        sort: 'scheduledAt,desc',
      });
      this.allInterventions.set(result.content);
    } finally {
      this.loading.set(false);
    }
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
