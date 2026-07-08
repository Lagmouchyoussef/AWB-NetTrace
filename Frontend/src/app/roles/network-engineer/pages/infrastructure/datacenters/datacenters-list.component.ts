import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerDatacenterService } from '../../../../../core/services/network-engineer-datacenter.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { Datacenter } from '../../../../super-admin/pages/datacenters/datacenter.model';
import { NeDatacenterDetailDialogComponent } from './datacenter-detail-dialog.component';

// Read-only: this role places devices, it doesn't create sites - no add/edit/delete anywhere.
@Component({
  selector: 'app-ne-datacenters-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './datacenters-list.component.html',
  styleUrl: './datacenters-list.component.css',
})
export class NeDatacentersListComponent implements OnInit {
  private readonly datacenterService = inject(NetworkEngineerDatacenterService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Datacenter>[] = [
    { key: 'name', headerKey: 'datacenters.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'datacenters.columns.code', cell: (row) => row.code },
    { key: 'city', headerKey: 'datacenters.columns.city', cell: (row) => row.city },
    {
      key: 'tier',
      headerKey: 'datacenters.columns.tier',
      cell: (row) => this.translateService.instant(`datacenters.tier.${row.tier}`),
    },
    {
      key: 'status',
      headerKey: 'datacenters.columns.status',
      cell: (row) => this.translateService.instant(`datacenters.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Datacenter[]>([]);
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

  protected onView(row: Datacenter): void {
    this.dialog.open(NeDatacenterDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.datacenterService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'City', 'Country', 'Tier', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.city,
      row.country,
      row.tier,
      row.status,
    ]);
    downloadCsv('datacenters.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.datacenterService.list({
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
