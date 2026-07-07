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
import { DcAdminSdwanEdgeService } from '../../../../core/services/dc-admin-sdwan-edge.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { SdwanEdge } from '../../../super-admin/pages/sdwan-edges/sdwan-edge.model';
import { DcAdminSdwanEdgeFormDialogComponent } from './sdwan-edge-form-dialog.component';
import { DcAdminSdwanEdgeDetailDialogComponent } from './sdwan-edge-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-sdwan-edges-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './sdwan-edges-list.component.html',
  styleUrl: './sdwan-edges-list.component.css',
})
export class DcAdminSdwanEdgesListComponent implements OnInit {
  private readonly sdwanEdgeService = inject(DcAdminSdwanEdgeService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<SdwanEdge>[] = [
    { key: 'name', headerKey: 'sdwanEdges.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'sdwanEdges.columns.code', cell: (row) => row.code },
    {
      key: 'datacenterName',
      headerKey: 'sdwanEdges.columns.datacenter',
      cell: (row) => row.datacenterName,
    },
    { key: 'vendor', headerKey: 'sdwanEdges.columns.vendor', cell: (row) => row.vendor },
    {
      key: 'status',
      headerKey: 'sdwanEdges.columns.status',
      cell: (row) => this.translateService.instant(`sdwanEdges.status.${row.status}`),
    },
  ];

  protected readonly data = signal<SdwanEdge[]>([]);
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
    const ref = this.dialog.open(DcAdminSdwanEdgeFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: SdwanEdge): void {
    this.dialog.open(DcAdminSdwanEdgeDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: SdwanEdge): void {
    const ref = this.dialog.open(DcAdminSdwanEdgeFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: SdwanEdge): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'sdwanEdges.deleteTitle',
      messageKey: 'sdwanEdges.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.sdwanEdgeService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.sdwanEdgeService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Datacenter', 'Vendor', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.datacenterName,
      row.vendor,
      row.status,
    ]);
    downloadCsv('sdwan-edges.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.sdwanEdgeService.list({
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
