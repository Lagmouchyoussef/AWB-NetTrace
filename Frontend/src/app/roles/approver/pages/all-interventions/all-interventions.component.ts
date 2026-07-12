import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

// Read-only, unscoped situational-awareness view - unlike the Approval Queue (pending only, with
// approve/reject actions), this shows every intervention regardless of status/decision, matching
// "View all intervention requests in their scope" from the role brief. No create/edit/delete
// affordance: Approver never manages the intervention record itself (see "My Requests" for the
// one place it can create - and that's requesting, not managing).
@Component({
  selector: 'app-approver-all-interventions',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './all-interventions.component.html',
  styleUrl: './all-interventions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverAllInterventionsComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);
  private readonly translateService = inject(TranslateService);

  protected readonly columns: DataTableColumn<Intervention>[] = [
    { key: 'title', headerKey: 'interventions.columns.title', cell: (row) => row.title },
    { key: 'deviceName', headerKey: 'interventions.fields.device', cell: (row) => row.deviceName },
    {
      key: 'interventionType',
      headerKey: 'interventions.columns.interventionType',
      cell: (row) =>
        this.translateService.instant(`interventions.interventionType.${row.interventionType}`),
    },
    {
      key: 'priority',
      headerKey: 'interventions.columns.priority',
      cell: (row) => this.translateService.instant(`interventions.priority.${row.priority}`),
    },
    {
      key: 'status',
      headerKey: 'interventions.columns.status',
      cell: (row) => this.translateService.instant(`interventions.status.${row.status}`),
    },
    {
      key: 'approvalStatus',
      headerKey: 'approver.allInterventions.approvalStatus',
      cell: (row) => this.translateService.instant(`interventions.approvalStatus.${row.approvalStatus}`),
    },
    {
      key: 'requestedByUsername',
      headerKey: 'interventions.approvalQueue.requestedBy',
      cell: (row) => row.requestedByUsername ?? '',
    },
  ];

  protected readonly data = signal<Intervention[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly loading = signal(false);

  private pageIndex = 0;
  private pageSize = 10;
  private sortParam?: string;
  private searchQuery?: string;

  ngOnInit(): void {
    this.load();
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  protected onSort(sort: Sort): void {
    this.sortParam = sort.direction ? `${sort.active},${sort.direction}` : undefined;
    this.load();
  }

  protected onSearch(query: string): void {
    this.searchQuery = query || undefined;
    this.pageIndex = 0;
    this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({
        page: this.pageIndex,
        size: this.pageSize,
        sort: this.sortParam,
        search: this.searchQuery,
      });
      this.data.set(result.content);
      this.totalCount.set(result.totalElements);
    } finally {
      this.loading.set(false);
    }
  }
}
