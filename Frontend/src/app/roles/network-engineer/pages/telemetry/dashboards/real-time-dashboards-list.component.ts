import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerRealTimeDashboardService } from '../../../../../core/services/network-engineer-real-time-dashboard.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { RealTimeDashboard } from '../../../../super-admin/pages/real-time-dashboards/real-time-dashboard.model';
import { NeRealTimeDashboardFormDialogComponent } from './real-time-dashboard-form-dialog.component';
import { NeRealTimeDashboardDetailDialogComponent } from './real-time-dashboard-detail-dialog.component';

// Create/edit allowed, no delete - decommission via status (ARCHIVED).
@Component({
  selector: 'app-ne-real-time-dashboards-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './real-time-dashboards-list.component.html',
  styleUrl: './real-time-dashboards-list.component.css',
})
export class NeRealTimeDashboardsListComponent implements OnInit {
  private readonly realTimeDashboardService = inject(NetworkEngineerRealTimeDashboardService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<RealTimeDashboard>[] = [
    { key: 'name', headerKey: 'realTimeDashboards.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'realTimeDashboards.columns.code', cell: (row) => row.code },
    {
      key: 'description',
      headerKey: 'realTimeDashboards.columns.description',
      cell: (row) => row.description ?? '',
    },
    {
      key: 'refreshIntervalSeconds',
      headerKey: 'realTimeDashboards.columns.refreshIntervalSeconds',
      cell: (row) => `${row.refreshIntervalSeconds}s`,
    },
    {
      key: 'widgetCount',
      headerKey: 'realTimeDashboards.columns.widgetCount',
      cell: (row) => String(row.widgetCount),
    },
    {
      key: 'status',
      headerKey: 'realTimeDashboards.columns.status',
      cell: (row) => this.translateService.instant(`realTimeDashboards.status.${row.status}`),
    },
  ];

  protected readonly data = signal<RealTimeDashboard[]>([]);
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

  protected onCreate(): void {
    const ref = this.dialog.open(NeRealTimeDashboardFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: RealTimeDashboard): void {
    this.dialog.open(NeRealTimeDashboardDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: RealTimeDashboard): void {
    const ref = this.dialog.open(NeRealTimeDashboardFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.realTimeDashboardService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Description', 'Refresh interval (s)', 'Widgets', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.description ?? '',
      String(row.refreshIntervalSeconds),
      String(row.widgetCount),
      row.status,
    ]);
    downloadCsv('real-time-dashboards.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.realTimeDashboardService.list({
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
