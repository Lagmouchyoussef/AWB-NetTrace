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
import { DatacenterService } from '../../../../core/services/datacenter.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Datacenter } from './datacenter.model';
import { DatacenterFormDialogComponent } from './datacenter-form-dialog.component';
import { DatacenterDetailDialogComponent } from './datacenter-detail-dialog.component';

@Component({
  selector: 'app-datacenters-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './datacenters-list.component.html',
  styleUrl: './datacenters-list.component.css',
})
export class DatacentersListComponent implements OnInit {
  private readonly datacenterService = inject(DatacenterService);
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

  protected onCreate(): void {
    const ref = this.dialog.open(DatacenterFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Datacenter): void {
    this.dialog.open(DatacenterDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Datacenter): void {
    const ref = this.dialog.open(DatacenterFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: Datacenter): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'datacenters.deleteTitle',
      messageKey: 'datacenters.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.datacenterService.delete(row.id);
      this.load();
    }
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
