import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerConnectorService } from '../../../../../core/services/network-engineer-connector.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { Connector } from '../../../../super-admin/pages/connectors/connector.model';
import { NeConnectorFormDialogComponent } from './connector-form-dialog.component';
import { NeConnectorDetailDialogComponent } from './connector-detail-dialog.component';

// Create/edit allowed, no delete - decommission via status (Connector already has
// DECOMMISSIONED).
@Component({
  selector: 'app-ne-connectors-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './connectors-list.component.html',
  styleUrl: './connectors-list.component.css',
})
export class NeConnectorsListComponent implements OnInit {
  private readonly connectorService = inject(NetworkEngineerConnectorService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Connector>[] = [
    { key: 'name', headerKey: 'connectors.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'connectors.columns.code', cell: (row) => row.code },
    { key: 'deviceName', headerKey: 'connectors.columns.device', cell: (row) => row.deviceName },
    {
      key: 'formFactor',
      headerKey: 'connectors.columns.formFactor',
      cell: (row) => this.translateService.instant(`connectors.formFactor.${row.formFactor}`),
    },
    {
      key: 'speedGbps',
      headerKey: 'connectors.columns.speedGbps',
      cell: (row) => `${row.speedGbps} Gbps`,
    },
    {
      key: 'status',
      headerKey: 'connectors.columns.status',
      cell: (row) => this.translateService.instant(`connectors.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Connector[]>([]);
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
    const ref = this.dialog.open(NeConnectorFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Connector): void {
    this.dialog.open(NeConnectorDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Connector): void {
    const ref = this.dialog.open(NeConnectorFormDialogComponent, {
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
    const all = await this.connectorService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Device', 'Form Factor', 'Speed (Gbps)', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.deviceName,
      row.formFactor,
      row.speedGbps,
      row.status,
    ]);
    downloadCsv('connectors.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.connectorService.list({
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
