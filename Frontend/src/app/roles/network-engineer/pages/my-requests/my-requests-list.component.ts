import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerInterventionService } from '../../../../core/services/network-engineer-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { NeInterventionRequestFormDialogComponent } from './intervention-request-form-dialog.component';

const PAGE_SIZE = 20;

// Personal timeline, not the generic DataTableComponent: this role only ever sees its own
// requests and cannot approve/reject/edit/delete, so a paginated admin-style table (built for
// managing many other people's records) would be the wrong shape here.
@Component({
  selector: 'app-ne-my-requests-list',
  standalone: true,
  imports: [DatePipe, MatIconModule, TranslatePipe],
  templateUrl: './my-requests-list.component.html',
  styleUrl: './my-requests-list.component.css',
})
export class NeMyRequestsListComponent implements OnInit {
  private readonly interventionService = inject(NetworkEngineerInterventionService);
  private readonly dialog = inject(MatDialog);

  protected readonly requests = signal<Intervention[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(false);

  private pageIndex = 0;

  ngOnInit(): void {
    this.load(false);
  }

  protected onNewRequest(): void {
    const ref = this.dialog.open(NeInterventionRequestFormDialogComponent, {
      width: '560px',
    });
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

  protected get hasMore(): boolean {
    return this.requests().length < this.totalCount();
  }

  private async load(append: boolean): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({
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
