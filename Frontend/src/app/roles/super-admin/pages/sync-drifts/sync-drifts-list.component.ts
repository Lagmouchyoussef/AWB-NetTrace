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
import { SyncDriftService } from '../../../../core/services/sync-drift.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { SyncDrift } from './sync-drift.model';
import { SyncDriftFormDialogComponent } from './sync-drift-form-dialog.component';
import { SyncDriftDetailDialogComponent } from './sync-drift-detail-dialog.component';

@Component({
  selector: 'app-sync-drifts-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './sync-drifts-list.component.html',
  styleUrl: './sync-drifts-list.component.css',
})
export class SyncDriftsListComponent implements OnInit {
  private readonly syncDriftService = inject(SyncDriftService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<SyncDrift>[] = [
    { key: 'title', headerKey: 'syncDrifts.columns.title', cell: (row) => row.title },
    { key: 'deviceName', headerKey: 'syncDrifts.columns.device', cell: (row) => row.deviceName },
    {
      key: 'driftType',
      headerKey: 'syncDrifts.columns.driftType',
      cell: (row) => this.translateService.instant(`syncDrifts.driftType.${row.driftType}`),
    },
    {
      key: 'severity',
      headerKey: 'syncDrifts.columns.severity',
      cell: (row) => this.translateService.instant(`syncDrifts.severity.${row.severity}`),
    },
    {
      key: 'status',
      headerKey: 'syncDrifts.columns.status',
      cell: (row) => this.translateService.instant(`syncDrifts.status.${row.status}`),
    },
    {
      key: 'detectedAt',
      headerKey: 'syncDrifts.columns.detectedAt',
      cell: (row) => new Date(row.detectedAt).toLocaleString(),
    },
  ];

  protected readonly data = signal<SyncDrift[]>([]);
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
    const ref = this.dialog.open(SyncDriftFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: SyncDrift): void {
    this.dialog.open(SyncDriftDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: SyncDrift): void {
    const ref = this.dialog.open(SyncDriftFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: SyncDrift): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'syncDrifts.deleteTitle',
      messageKey: 'syncDrifts.deleteMessage',
      messageParams: { name: row.title },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.syncDriftService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.syncDriftService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Title', 'Device', 'Type', 'Severity', 'Status', 'Detected at'];
    const rows = all.content.map((row) => [
      row.title,
      row.deviceName,
      row.driftType,
      row.severity,
      row.status,
      row.detectedAt,
    ]);
    downloadCsv('sync-drifts.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.syncDriftService.list({
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
