import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css',
})
export class SuperAdminDashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly translateService = inject(TranslateService);

  protected readonly summary = toSignal(this.dashboardService.summary$, { initialValue: null });

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
