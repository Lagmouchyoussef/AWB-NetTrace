import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerSdwanEdgeService } from '../../../../../core/services/network-engineer-sdwan-edge.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { SdwanEdge } from '../../../../super-admin/pages/sdwan-edges/sdwan-edge.model';
import { NeSdwanEdgeFormDialogComponent } from './sdwan-edge-form-dialog.component';
import { NeSdwanEdgeDetailDialogComponent } from './sdwan-edge-detail-dialog.component';

// Create/edit allowed, no delete - decommission via status.
@Component({
  selector: 'app-ne-sdwan-edges-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './sdwan-edges-list.component.html',
  styleUrl: './sdwan-edges-list.component.css',
})
export class NeSdwanEdgesListComponent implements OnInit {
  private readonly sdwanEdgeService = inject(NetworkEngineerSdwanEdgeService);
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
    const ref = this.dialog.open(NeSdwanEdgeFormDialogComponent, {
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
    this.dialog.open(NeSdwanEdgeDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: SdwanEdge): void {
    const ref = this.dialog.open(NeSdwanEdgeFormDialogComponent, {
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
