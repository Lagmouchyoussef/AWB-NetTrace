import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { OverlayNetworkService } from '../../../../core/services/overlay-network.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { OverlayNetwork } from './overlay-network.model';
import { OverlayNetworkDetailDialogComponent } from './overlay-network-detail-dialog.component';

// Read-only: the backend controller only exposes GET (list + detail) - POST/PUT/DELETE were
// removed. No create/edit/delete affordance here (readOnly on the table hides them).
@Component({
  selector: 'app-overlay-networks-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './overlay-networks-list.component.html',
  styleUrl: './overlay-networks-list.component.css',
})
export class OverlayNetworksListComponent implements OnInit {
  private readonly overlayNetworkService = inject(OverlayNetworkService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<OverlayNetwork>[] = [
    { key: 'name', headerKey: 'overlayNetworks.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'overlayNetworks.columns.code', cell: (row) => row.code },
    {
      key: 'datacenterName',
      headerKey: 'overlayNetworks.columns.datacenter',
      cell: (row) => row.datacenterName,
    },
    { key: 'vni', headerKey: 'overlayNetworks.columns.vni', cell: (row) => String(row.vni) },
    {
      key: 'overlayType',
      headerKey: 'overlayNetworks.columns.overlayType',
      cell: (row) =>
        this.translateService.instant(`overlayNetworks.overlayType.${row.overlayType}`),
    },
    {
      key: 'status',
      headerKey: 'overlayNetworks.columns.status',
      cell: (row) => this.translateService.instant(`overlayNetworks.status.${row.status}`),
    },
  ];

  protected readonly data = signal<OverlayNetwork[]>([]);
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

  protected onView(row: OverlayNetwork): void {
    this.dialog.open(OverlayNetworkDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.overlayNetworkService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Datacenter', 'VNI', 'Overlay Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.datacenterName,
      row.vni,
      row.overlayType,
      row.status,
    ]);
    downloadCsv('overlay-networks.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.overlayNetworkService.list({
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
