import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { RequesterDashboardService } from '../../../../core/services/requester-dashboard.service';
import { RequesterInterventionService } from '../../../../core/services/requester-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { RequesterRequestFormDialogComponent } from './request-form-dialog.component';

// Personal timeline, not the generic DataTableComponent: this role only ever sees its own
// requests and cannot approve/reject/edit - mirrors ApproverMyRequestsComponent, but consumes the
// same shared live stream as the Dashboard (RequesterDashboardService.requests$) instead of its
// own paginated fetch - a single 100-item fetch covers a personal history comfortably, and every
// screen refreshes together the moment a decision happens elsewhere (mirrors the Approval Queue/
// Dashboard pairing on the Approver side).
@Component({
  selector: 'app-requester-my-requests-list',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './my-requests-list.component.html',
  styleUrl: './my-requests-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequesterMyRequestsListComponent {
  private readonly dashboardService = inject(RequesterDashboardService);
  private readonly interventionService = inject(RequesterInterventionService);
  private readonly dialog = inject(MatDialog);

  private readonly page = toSignal(this.dashboardService.requests$, { initialValue: null });

  protected readonly loading = computed(() => this.page() === null);
  protected readonly requests = computed<Intervention[]>(() => this.page()?.content ?? []);

  protected onNewRequest(): void {
    const ref = this.dialog.open(RequesterRequestFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.dashboardService.triggerRefresh();
      }
    });
  }

  protected canDelete(request: Intervention): boolean {
    return request.approvalStatus === 'PENDING';
  }

  protected onDelete(request: Intervention): void {
    const data: ConfirmDialogData = {
      titleKey: 'interventions.myRequests.deleteConfirmTitle',
      messageKey: 'interventions.myRequests.deleteConfirmMessage',
      messageParams: { title: request.title },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data });
    ref.afterClosed().subscribe(async (confirmed: boolean | string) => {
      if (!confirmed) {
        return;
      }
      await this.interventionService.deleteMyRequest(request.id);
      this.dashboardService.triggerRefresh();
    });
  }

  // Deliberately not Angular's DatePipe - see approval-queue.component.ts for why.
  protected formatDate(iso: string): string {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
