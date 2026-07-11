import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorReportService } from '../../../../core/services/auditor-report.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Report } from '../../../super-admin/pages/reports/report.model';
import { AuditorReportDetailDialogComponent } from './report-detail-dialog.component';

// Read-only view of the report-definition registry (this catalogs report metadata, it doesn't
// generate files - see ReportService). No write mapping exists on AuditorReportController.
@Component({
  selector: 'app-auditor-reports-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.css',
})
export class AuditorReportsListComponent implements OnInit {
  private readonly reportService = inject(AuditorReportService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Report>[] = [
    { key: 'name', headerKey: 'reports.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'reports.columns.code', cell: (row) => row.code },
    {
      key: 'reportType',
      headerKey: 'reports.columns.reportType',
      cell: (row) => this.translateService.instant(`reports.reportType.${row.reportType}`),
    },
    {
      key: 'format',
      headerKey: 'reports.columns.format',
      cell: (row) => this.translateService.instant(`reports.format.${row.format}`),
    },
    {
      key: 'schedule',
      headerKey: 'reports.columns.schedule',
      cell: (row) => this.translateService.instant(`reports.schedule.${row.schedule}`),
    },
    {
      key: 'status',
      headerKey: 'reports.columns.status',
      cell: (row) => this.translateService.instant(`reports.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Report[]>([]);
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

  protected onView(row: Report): void {
    this.dialog.open(AuditorReportDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.reportService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Type', 'Format', 'Schedule', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.reportType,
      row.format,
      row.schedule,
      row.status,
    ]);
    downloadCsv('reports.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.reportService.list({
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
