import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { ApproverRequestFormDialogComponent } from './request-form-dialog.component';

const PAGE_SIZE = 20;

// Approver acting as a requester - identical in spirit and structure to Network Engineer's
// NeMyRequestsListComponent. A request created here is never in this same user's own Approval
// Queue for a decision - InterventionService.approve/reject's requireNotOwnRequest guard enforces
// that server-side regardless of this screen.
@Component({
  selector: 'app-approver-my-requests',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverMyRequestsComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);
  private readonly dialog = inject(MatDialog);

  protected readonly requests = signal<Intervention[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(false);

  private pageIndex = 0;

  ngOnInit(): void {
    this.load(false);
  }

  protected onNewRequest(): void {
    const ref = this.dialog.open(ApproverRequestFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.pageIndex = 0;
        this.load(false);
      }
    });
  }

  protected onLoadMore(): void {
    this.pageIndex += 1;
    this.load(true);
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
      this.pageIndex = 0;
      await this.load(false);
    });
  }

  protected get hasMore(): boolean {
    return this.requests().length < this.totalCount();
  }

  // Deliberately not Angular's DatePipe - see approval-queue.component.ts for why.
  protected formatDate(iso: string): string {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private async load(append: boolean): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.listMyRequests({
        page: this.pageIndex,
        size: PAGE_SIZE,
        sort: 'createdAt,desc',
      });
      this.requests.set(append ? [...this.requests(), ...result.content] : result.content);
      this.totalCount.set(result.totalElements);
    } finally {
      this.loading.set(false);
    }
  }
}
