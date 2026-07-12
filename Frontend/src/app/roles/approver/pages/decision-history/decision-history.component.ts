import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

const PAGE_SIZE = 20;

// Read-only timeline of this approver's own past decisions (approved or rejected - PENDING is
// never returned, see InterventionService.listDecisions) - covers both "My Decision History" and
// "Audit Log (own decisions)" from the original brief, merged into one screen since they'd
// otherwise show the exact same data under two names. Same "load more" personal-list pattern as
// My Requests, not the generic DataTableComponent (this is a personal record, not a managed set).
@Component({
  selector: 'app-approver-decision-history',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './decision-history.component.html',
  styleUrl: './decision-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverDecisionHistoryComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);

  protected readonly decisions = signal<Intervention[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(false);

  private pageIndex = 0;

  ngOnInit(): void {
    this.load(false);
  }

  protected onLoadMore(): void {
    this.pageIndex += 1;
    this.load(true);
  }

  protected get hasMore(): boolean {
    return this.decisions().length < this.totalCount();
  }

  // Deliberately not Angular's DatePipe - see approval-queue.component.ts for why.
  protected formatDate(iso: string | null): string {
    if (!iso) {
      return '';
    }
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private async load(append: boolean): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.listDecisions({
        page: this.pageIndex,
        size: PAGE_SIZE,
        sort: 'decidedAt,desc',
      });
      this.decisions.set(append ? [...this.decisions(), ...result.content] : result.content);
      this.totalCount.set(result.totalElements);
    } finally {
      this.loading.set(false);
    }
  }
}
