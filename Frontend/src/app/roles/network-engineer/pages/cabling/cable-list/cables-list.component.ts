import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { NetworkEngineerCableService } from '../../../../../core/services/network-engineer-cable.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { Cable } from '../../../../super-admin/pages/cables/cable.model';
import { NeCableFormDialogComponent } from './cable-form-dialog.component';
import { NeCableDetailDialogComponent } from './cable-detail-dialog.component';

// No delete anywhere - "Decommission" is the custom row action, a status change to DISCONNECTED
// with a mandatory reason (appended to notes), never a hard delete.
@Component({
  selector: 'app-ne-cables-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './cables-list.component.html',
  styleUrl: './cables-list.component.css',
})
export class NeCablesListComponent implements OnInit {
  private readonly cableService = inject(NetworkEngineerCableService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Cable>[] = [
    { key: 'name', headerKey: 'cables.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'cables.columns.code', cell: (row) => row.code },
    {
      key: 'sourceDeviceName',
      headerKey: 'cables.columns.source',
      cell: (row) => row.sourceDeviceName,
    },
    {
      key: 'targetDeviceName',
      headerKey: 'cables.columns.target',
      cell: (row) => row.targetDeviceName,
    },
    {
      key: 'cableType',
      headerKey: 'cables.columns.cableType',
      cell: (row) => this.translateService.instant(`cables.cableType.${row.cableType}`),
    },
    {
      key: 'status',
      headerKey: 'cables.columns.status',
      cell: (row) => this.translateService.instant(`cables.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Cable[]>([]);
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
    const ref = this.dialog.open(NeCableFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Cable): void {
    this.dialog.open(NeCableDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Cable): void {
    const ref = this.dialog.open(NeCableFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDecommission(row: Cable): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'cables.decommissionTitle',
      messageKey: 'cables.decommissionMessage',
      messageParams: { name: row.name },
      confirmKey: 'cables.decommission',
      danger: true,
      requireReason: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const result = await firstValueFrom(ref.afterClosed());
    if (result) {
      const reason = typeof result === 'string' ? result : '';
      await this.cableService.update(row.id, {
        name: row.name,
        code: row.code,
        sourceDeviceId: row.sourceDeviceId,
        targetDeviceId: row.targetDeviceId,
        cableType: row.cableType,
        lengthMeters: row.lengthMeters,
        status: 'DISCONNECTED',
        notes: row.notes
          ? `${row.notes}\n\nDecommissioned: ${reason}`
          : `Decommissioned: ${reason}`,
      });
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.cableService.list({ page: 0, size: 10000, search: this.searchQuery });
    const header = ['Name', 'Code', 'Source', 'Target', 'Cable Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.sourceDeviceName,
      row.targetDeviceName,
      row.cableType,
      row.status,
    ]);
    downloadCsv('cables.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.cableService.list({
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
