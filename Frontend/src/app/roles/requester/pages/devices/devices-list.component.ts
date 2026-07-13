import { Component, OnInit, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { RequesterDeviceService } from '../../../../core/services/requester-device.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Device } from '../../../super-admin/pages/devices/device.model';

// Read-only reference directory - lets the requester look up device names/racks before opening
// the "New Request" dialog, without any device-management capability (see
// RequesterDeviceController: GET-only backend, mirrors the read-only pattern already established
// for the Auditor's own oversight screens).
@Component({
  selector: 'app-requester-devices-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './devices-list.component.html',
  styleUrl: './devices-list.component.css',
})
export class RequesterDevicesListComponent implements OnInit {
  private readonly deviceService = inject(RequesterDeviceService);
  private readonly translateService = inject(TranslateService);

  protected readonly columns: DataTableColumn<Device>[] = [
    { key: 'name', headerKey: 'devices.columns.name', cell: (row) => row.name },
    { key: 'rackName', headerKey: 'devices.columns.rack', cell: (row) => row.rackName },
    {
      key: 'deviceType',
      headerKey: 'devices.columns.deviceType',
      cell: (row) => this.translateService.instant(`devices.deviceType.${row.deviceType}`),
    },
    {
      key: 'status',
      headerKey: 'devices.columns.status',
      cell: (row) => this.translateService.instant(`devices.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Device[]>([]);
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

  protected async onExportCsv(): Promise<void> {
    const all = await this.deviceService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Rack', 'Type', 'Status'];
    const rows = all.content.map((row) => [row.name, row.rackName, row.deviceType, row.status]);
    downloadCsv('devices.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.deviceService.list({
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
