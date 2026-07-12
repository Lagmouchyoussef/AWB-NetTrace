import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorInterventionService } from '../../../../core/services/auditor-intervention.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';
import { AuditorInterventionDetailDialogComponent } from './intervention-detail-dialog.component';

// Unscoped, read-only trail across every intervention regardless of status/decision - no
// create/edit/delete affordance anywhere (see AuditorInterventionController: GET-only backend).
@Component({
  selector: 'app-auditor-interventions-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './interventions-list.component.html',
  styleUrl: './interventions-list.component.css',
})
export class AuditorInterventionsListComponent implements OnInit {
  private readonly interventionService = inject(AuditorInterventionService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Intervention>[] = [
    { key: 'title', headerKey: 'interventions.columns.title', cell: (row) => row.title },
    { key: 'deviceName', headerKey: 'interventions.fields.device', cell: (row) => row.deviceName },
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
      headerKey: 'auditor.interventions.approvalStatus',
      cell: (row) =>
        this.translateService.instant(`interventions.approvalStatus.${row.approvalStatus}`),
    },
    {
      key: 'requestedByUsername',
      headerKey: 'interventions.approvalQueue.requestedBy',
      cell: (row) => row.requestedByUsername ?? '',
    },
    {
      key: 'approvedByUsername',
      headerKey: 'auditor.interventions.approvedBy',
      cell: (row) => row.approvedByUsername ?? '',
    },
    {
      key: 'scheduledAt',
      headerKey: 'interventions.columns.scheduledAt',
      cell: (row) => new Date(row.scheduledAt).toLocaleString(),
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

  protected onView(row: Intervention): void {
    this.dialog.open(AuditorInterventionDetailDialogComponent, { width: '520px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.interventionService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = [
      'Title',
      'Device',
      'Priority',
      'Status',
      'Approval Status',
      'Requested By',
      'Approved By',
      'Scheduled At',
    ];
    const rows = all.content.map((row) => [
      row.title,
      row.deviceName,
      row.priority,
      row.status,
      row.approvalStatus,
      row.requestedByUsername ?? '',
      row.approvedByUsername ?? '',
      row.scheduledAt,
    ]);
    downloadCsv('interventions-trail.csv', header, rows);
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
