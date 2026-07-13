import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { RequesterDashboardService } from '../../../../core/services/requester-dashboard.service';
import { ApprovalStatus, Intervention } from '../../../super-admin/pages/interventions/intervention.model';

const STATUS_COLOR_ROLES: Record<ApprovalStatus, string> = {
  PENDING: 'warning',
  APPROVED: 'good',
  REJECTED: 'critical',
};

// Everything here is derived client-side from the shared live request stream
// (RequesterDashboardService) - same data, same 30s-poll + notification-triggered refresh the
// other dashboards use, so this screen, My Requests, Calendar and Reports always agree and update
// together without a manual reload (see ApproverDashboardService for the same pattern).
@Component({
  selector: 'app-requester-dashboard',
  standalone: true,
  imports: [TranslatePipe, StatChartComponent, RouterLink],
  templateUrl: './requester-dashboard.component.html',
  styleUrl: './requester-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequesterDashboardComponent {
  private readonly dashboardService = inject(RequesterDashboardService);
  private readonly translateService = inject(TranslateService);

  private readonly page = toSignal(this.dashboardService.requests$, { initialValue: null });

  protected readonly loading = computed(() => this.page() === null);
  private readonly requests = computed<Intervention[]>(() => this.page()?.content ?? []);

  protected readonly totalCount = computed(() => this.page()?.totalElements ?? 0);
  protected readonly pendingCount = computed(
    () => this.requests().filter((r) => r.approvalStatus === 'PENDING').length,
  );
  protected readonly approvedCount = computed(
    () => this.requests().filter((r) => r.approvalStatus === 'APPROVED').length,
  );
  protected readonly rejectedCount = computed(
    () => this.requests().filter((r) => r.approvalStatus === 'REJECTED').length,
  );

  protected readonly statusBreakdownData = computed<ChartDatum[]>(() => {
    const counts = new Map<ApprovalStatus, number>();
    for (const request of this.requests()) {
      counts.set(request.approvalStatus, (counts.get(request.approvalStatus) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([status, count]) => ({
      label: this.translateService.instant(`interventions.approvalStatus.${status}`),
      count,
      colorRole: STATUS_COLOR_ROLES[status],
    }));
  });
}
