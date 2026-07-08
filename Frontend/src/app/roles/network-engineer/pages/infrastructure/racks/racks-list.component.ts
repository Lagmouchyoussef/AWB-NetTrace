import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerRackService } from '../../../../../core/services/network-engineer-rack.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { Rack } from '../../../../super-admin/pages/racks/rack.model';
import { NeRackDetailDialogComponent } from './rack-detail-dialog.component';

// Read-only: see NeDatacentersListComponent.
@Component({
  selector: 'app-ne-racks-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './racks-list.component.html',
  styleUrl: './racks-list.component.css',
})
export class NeRacksListComponent implements OnInit {
  private readonly rackService = inject(NetworkEngineerRackService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Rack>[] = [
    { key: 'name', headerKey: 'racks.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'racks.columns.code', cell: (row) => row.code },
    { key: 'roomName', headerKey: 'racks.columns.room', cell: (row) => row.roomName },
    { key: 'heightU', headerKey: 'racks.columns.heightU', cell: (row) => `${row.heightU}U` },
    {
      key: 'containment',
      headerKey: 'racks.columns.containment',
      cell: (row) => this.translateService.instant(`racks.containment.${row.containment}`),
    },
    {
      key: 'status',
      headerKey: 'racks.columns.status',
      cell: (row) => this.translateService.instant(`racks.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Rack[]>([]);
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

  protected onView(row: Rack): void {
    this.dialog.open(NeRackDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.rackService.list({ page: 0, size: 10000, search: this.searchQuery });
    const header = ['Name', 'Code', 'Room', 'Height (U)', 'Containment', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.roomName,
      row.heightU,
      row.containment,
      row.status,
    ]);
    downloadCsv('racks.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.rackService.list({
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
