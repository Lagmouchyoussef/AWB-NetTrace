import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { AuditorDashboardService } from '../../../../core/services/auditor-dashboard.service';

// Everything here is derived from the shared live summary stream (AuditorDashboardService) - same
// 30s-poll + notification-triggered refresh the other roles' dashboards use, so this screen
// reacts the moment anyone anywhere logs an auditable action, without a manual reload.
@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe, StatChartComponent],
  templateUrl: './auditor-dashboard.component.html',
  styleUrl: './auditor-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditorDashboardComponent {
  private readonly dashboardService = inject(AuditorDashboardService);

  private readonly summary = toSignal(this.dashboardService.summary$, { initialValue: null });

  protected readonly loading = computed(() => this.summary() === null);

  protected readonly totalAuditEvents = computed(() => this.summary()?.totalAuditEvents ?? 0);
  protected readonly openAnomaliesCount = computed(() => this.summary()?.openAnomaliesCount ?? 0);
  protected readonly criticalAnomaliesCount = computed(
    () => this.summary()?.criticalAnomaliesCount ?? 0,
  );
  protected readonly activeReportsCount = computed(() => this.summary()?.activeReportsCount ?? 0);

  protected readonly actionData = computed<ChartDatum[]>(() => this.summary()?.actionData ?? []);
  protected readonly severityData = computed<ChartDatum[]>(
    () => this.summary()?.severityData ?? [],
  );
}
