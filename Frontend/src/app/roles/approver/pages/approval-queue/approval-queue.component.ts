import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ApproverDashboardService } from '../../../../core/services/approver-dashboard.service';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { RejectDialogComponent } from './reject-dialog.component';

// Same structure/interaction as DcAdminApprovalQueueComponent, pointed at the unscoped
// ApproverInterventionService instead - this queue shows pending requests globally, not limited
// to a set of assigned datacenters (Approver has no such scoping concept). Consumes the same
// live-refreshing stream the Dashboard does (ApproverDashboardService.queue$) instead of a private
// one-shot fetch, so both screens always agree and update together (30s poll + instant refresh
// whenever any role's action produces a relevant notification).
@Component({
  selector: 'app-approver-approval-queue',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './approval-queue.component.html',
  styleUrl: './approval-queue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverApprovalQueueComponent {
  private readonly interventionService = inject(ApproverInterventionService);
  private readonly dashboardService = inject(ApproverDashboardService);
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  private readonly queue = toSignal(this.dashboardService.queue$, { initialValue: null });

  protected readonly loading = computed(() => this.queue() === null);
  protected readonly requests = computed<Intervention[]>(() => this.queue()?.content ?? []);
  protected readonly totalCount = computed(() => this.queue()?.totalElements ?? 0);
  protected readonly pendingActionIds = signal<Set<number>>(new Set());

  protected readonly currentUsername = computed(() => this.authService.username());

  protected isOwnRequest(request: Intervention): boolean {
    return request.requestedByUsername === this.currentUsername();
  }

  protected isActing(request: Intervention): boolean {
    return this.pendingActionIds().has(request.id);
  }

  protected interventionTypeLabel(request: Intervention): string {
    return this.translateService.instant(
      `interventions.interventionType.${request.interventionType}`,
    );
  }

  // Deliberately not Angular's DatePipe: the app has no registerLocaleData, so a locale-formatted
  // date (e.g. the `| date: 'medium'` DC Admin's own queue uses) would always render in English
  // regardless of the active UI language. A plain numeric format sidesteps that.
  protected formatDate(iso: string): string {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  protected async onApprove(request: Intervention): Promise<void> {
    this.setActing(request.id, true);
    try {
      await this.interventionService.approve(request.id);
    } finally {
      this.setActing(request.id, false);
      // Refreshes the shared stream, not just this component - the Dashboard picks up the same
      // change immediately too.
      this.dashboardService.triggerRefresh();
    }
  }

  protected onReject(request: Intervention): void {
    const ref = this.dialog.open(RejectDialogComponent, {
      width: '480px',
      data: { title: request.title },
    });
    ref.afterClosed().subscribe(async (comment: string | undefined) => {
      if (!comment) {
        return;
      }
      this.setActing(request.id, true);
      try {
        await this.interventionService.reject(request.id, comment);
      } finally {
        this.setActing(request.id, false);
        this.dashboardService.triggerRefresh();
      }
    });
  }

  private setActing(id: number, acting: boolean): void {
    this.pendingActionIds.update((current) => {
      const next = new Set(current);
      if (acting) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
