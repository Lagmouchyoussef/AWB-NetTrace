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
import { RackService } from '../../../../core/services/rack.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Rack } from './rack.model';
import { RackFormDialogComponent } from './rack-form-dialog.component';
import { RackDetailDialogComponent } from './rack-detail-dialog.component';

@Component({
  selector: 'app-racks-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './racks-list.component.html',
  styleUrl: './racks-list.component.css',
})
export class RacksListComponent implements OnInit {
  private readonly rackService = inject(RackService);
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

  protected onCreate(): void {
    const ref = this.dialog.open(RackFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Rack): void {
    this.dialog.open(RackDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Rack): void {
    const ref = this.dialog.open(RackFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: Rack): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'racks.deleteTitle',
      messageKey: 'racks.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.rackService.delete(row.id);
      this.load();
    }
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
