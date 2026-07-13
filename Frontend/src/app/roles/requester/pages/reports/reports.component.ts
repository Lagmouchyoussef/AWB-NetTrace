import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { RequesterDashboardService } from '../../../../core/services/requester-dashboard.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

const PRIORITY_COLOR_ROLES: Record<string, string> = {
  CRITICAL: 'critical',
  HIGH: 'serious',
  MEDIUM: 'warning',
  LOW: 'good',
};

// Real statistics computed from this requester's own submission history, over a selectable
// period - mirrors ApproverReportsComponent, but fed by the same shared live stream the
// Dashboard/My Requests use (RequesterDashboardService.requests$) instead of a separate
// listDecisions call: a single user's full history already carries approvalStatus/decidedAt, no
// extra endpoint needed. Genuine CSV export (core/utils/csv-export.ts), no PDF generation -
// nothing in this codebase renders files server-side (see ApproverReportsComponent for why).
@Component({
  selector: 'app-requester-reports',
  standalone: true,
  imports: [TranslatePipe, StatChartComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequesterReportsComponent {
  private readonly dashboardService = inject(RequesterDashboardService);
  private readonly translateService = inject(TranslateService);

  private readonly page = toSignal(this.dashboardService.requests$, { initialValue: null });
  protected readonly loading = computed(() => this.page() === null);

  protected readonly daysRange = signal(30);

  protected readonly periodDecisions = computed<Intervention[]>(() => {
    const cutoff = Date.now() - this.daysRange() * 24 * 60 * 60 * 1000;
    return (this.page()?.content ?? []).filter(
      (d) => d.decidedAt && new Date(d.decidedAt).getTime() >= cutoff,
    );
  });

  protected readonly approvedCount = computed(
    () => this.periodDecisions().filter((d) => d.approvalStatus === 'APPROVED').length,
  );
  protected readonly rejectedCount = computed(
    () => this.periodDecisions().filter((d) => d.approvalStatus === 'REJECTED').length,
  );
  protected readonly approvalRate = computed(() => {
    const total = this.periodDecisions().length;
    return total === 0 ? 0 : Math.round((this.approvedCount() / total) * 1000) / 10;
  });
  protected readonly avgDecisionHours = computed(() => {
    const items = this.periodDecisions().filter((d) => d.decidedAt);
    if (items.length === 0) {
      return 0;
    }
    const totalHours = items.reduce((sum, d) => {
      const created = new Date(d.createdAt).getTime();
      const decided = new Date(d.decidedAt as string).getTime();
      return sum + (decided - created) / (1000 * 60 * 60);
    }, 0);
    return Math.round((totalHours / items.length) * 10) / 10;
  });

  protected readonly outcomeData = computed<ChartDatum[]>(() => [
    {
      label: this.translateService.instant('interventions.approvalStatus.APPROVED'),
      count: this.approvedCount(),
      colorRole: 'good',
    },
    {
      label: this.translateService.instant('interventions.approvalStatus.REJECTED'),
      count: this.rejectedCount(),
      colorRole: 'critical',
    },
  ]);

  protected readonly priorityData = computed<ChartDatum[]>(() => {
    const counts = new Map<string, number>();
    for (const d of this.periodDecisions()) {
      counts.set(d.priority, (counts.get(d.priority) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([priority, count]) => ({
      label: this.translateService.instant(`interventions.priority.${priority}`),
      count,
      colorRole: PRIORITY_COLOR_ROLES[priority],
    }));
  });

  protected setDaysRange(days: number): void {
    this.daysRange.set(days);
  }

  protected onExportCsv(): void {
    const header = [
      this.translateService.instant('interventions.columns.title'),
      this.translateService.instant('interventions.fields.device'),
      this.translateService.instant('auditor.interventions.approvalStatus'),
      this.translateService.instant('auditor.interventions.approvedBy'),
      this.translateService.instant('requester.reports.decidedAt'),
      this.translateService.instant('interventions.approvalQueue.rejectCommentLabel'),
    ];
    const rows = this.periodDecisions().map((d) => [
      d.title,
      d.deviceName,
      this.translateService.instant(`interventions.approvalStatus.${d.approvalStatus}`),
      d.approvedByUsername ?? '',
      d.decidedAt ?? '',
      d.approvalComment ?? '',
    ]);
    downloadCsv(`my-requests-${this.daysRange()}d.csv`, header, rows);
  }
}
