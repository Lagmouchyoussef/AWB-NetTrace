import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { DcAdminPathTraceService } from '../../../../core/services/dc-admin-path-trace.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { PathTrace } from '../../../super-admin/pages/path-traces/path-trace.model';
import { DcAdminPathTraceFormDialogComponent } from './path-trace-form-dialog.component';
import { DcAdminPathTraceDetailDialogComponent } from './path-trace-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-path-traces-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './path-traces-list.component.html',
  styleUrl: './path-traces-list.component.css',
})
export class DcAdminPathTracesListComponent implements OnInit {
  private readonly pathTraceService = inject(DcAdminPathTraceService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<PathTrace>[] = [
    { key: 'name', headerKey: 'pathTraces.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'pathTraces.columns.code', cell: (row) => row.code },
    {
      key: 'sourceDeviceName',
      headerKey: 'pathTraces.columns.source',
      cell: (row) => row.sourceDeviceName,
    },
    {
      key: 'targetDeviceName',
      headerKey: 'pathTraces.columns.target',
      cell: (row) => row.targetDeviceName,
    },
    {
      key: 'hopCount',
      headerKey: 'pathTraces.columns.hopCount',
      cell: (row) => String(row.hopCount),
    },
    {
      key: 'status',
      headerKey: 'pathTraces.columns.status',
      cell: (row) => this.translateService.instant(`pathTraces.status.${row.status}`),
    },
  ];

  protected readonly data = signal<PathTrace[]>([]);
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
    const ref = this.dialog.open(DcAdminPathTraceFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: PathTrace): void {
    this.dialog.open(DcAdminPathTraceDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: PathTrace): void {
    const ref = this.dialog.open(DcAdminPathTraceFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: PathTrace): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'pathTraces.deleteTitle',
      messageKey: 'pathTraces.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.pathTraceService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.pathTraceService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Source', 'Target', 'Hop Count', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.sourceDeviceName,
      row.targetDeviceName,
      row.hopCount,
      row.status,
    ]);
    downloadCsv('path-traces.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.pathTraceService.list({
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
