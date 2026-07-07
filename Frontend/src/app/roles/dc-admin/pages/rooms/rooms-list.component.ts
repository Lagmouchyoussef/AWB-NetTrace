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
import { DcAdminRoomService } from '../../../../core/services/dc-admin-room.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Room } from '../../../super-admin/pages/rooms/room.model';
import { DcAdminRoomFormDialogComponent } from './room-form-dialog.component';
import { DcAdminRoomDetailDialogComponent } from './room-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-rooms-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css',
})
export class DcAdminRoomsListComponent implements OnInit {
  private readonly roomService = inject(DcAdminRoomService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Room>[] = [
    { key: 'name', headerKey: 'rooms.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'rooms.columns.code', cell: (row) => row.code },
    {
      key: 'datacenterName',
      headerKey: 'rooms.columns.datacenter',
      cell: (row) => row.datacenterName,
    },
    {
      key: 'roomType',
      headerKey: 'rooms.columns.roomType',
      cell: (row) => this.translateService.instant(`rooms.roomType.${row.roomType}`),
    },
    {
      key: 'coolingType',
      headerKey: 'rooms.columns.coolingType',
      cell: (row) => this.translateService.instant(`rooms.coolingType.${row.coolingType}`),
    },
    {
      key: 'status',
      headerKey: 'rooms.columns.status',
      cell: (row) => this.translateService.instant(`rooms.status.${row.status}`),
    },
  ];

  protected readonly data = signal<Room[]>([]);
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
    const ref = this.dialog.open(DcAdminRoomFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Room): void {
    this.dialog.open(DcAdminRoomDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Room): void {
    const ref = this.dialog.open(DcAdminRoomFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: Room): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'rooms.deleteTitle',
      messageKey: 'rooms.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.roomService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.roomService.list({ page: 0, size: 10000, search: this.searchQuery });
    const header = ['Name', 'Code', 'Datacenter', 'Room Type', 'Cooling Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.datacenterName,
      row.roomType,
      row.coolingType,
      row.status,
    ]);
    downloadCsv('rooms.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.roomService.list({
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
