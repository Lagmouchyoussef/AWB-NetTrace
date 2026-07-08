import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { Device } from '../../../../super-admin/pages/devices/device.model';
import { NeDeviceFormDialogComponent } from './device-form-dialog.component';
import { NeDeviceDetailDialogComponent } from './device-detail-dialog.component';

// Create/edit allowed, no delete anywhere - decommission is a status change made from the edit
// form (DeviceStatus already has DECOMMISSIONED), never a hard delete.
@Component({
  selector: 'app-ne-devices-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './devices-list.component.html',
  styleUrl: './devices-list.component.css',
})
export class NeDevicesListComponent implements OnInit {
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Device>[] = [
    { key: 'name', headerKey: 'devices.columns.name', cell: (row) => row.name },
    {
      key: 'serialNumber',
      headerKey: 'devices.columns.serialNumber',
      cell: (row) => row.serialNumber,
    },
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

  protected onCreate(): void {
    const ref = this.dialog.open(NeDeviceFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Device): void {
    this.dialog.open(NeDeviceDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Device): void {
    const ref = this.dialog.open(NeDeviceFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.deviceService.list({ page: 0, size: 10000, search: this.searchQuery });
    const header = ['Name', 'Serial Number', 'Rack', 'Device Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.serialNumber,
      row.rackName,
      row.deviceType,
      row.status,
    ]);
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
