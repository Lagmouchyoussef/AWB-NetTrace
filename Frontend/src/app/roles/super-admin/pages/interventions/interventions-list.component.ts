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
import { InterventionService } from '../../../../core/services/intervention.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Intervention } from './intervention.model';
import { InterventionFormDialogComponent } from './intervention-form-dialog.component';
import { InterventionDetailDialogComponent } from './intervention-detail-dialog.component';

@Component({
  selector: 'app-interventions-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './interventions-list.component.html',
  styleUrl: './interventions-list.component.css',
})
export class InterventionsListComponent implements OnInit {
  private readonly interventionService = inject(InterventionService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<Intervention>[] = [
    { key: 'title', headerKey: 'interventions.columns.title', cell: (row) => row.title },
    { key: 'deviceName', headerKey: 'interventions.columns.device', cell: (row) => row.deviceName },
    {
      key: 'interventionType',
      headerKey: 'interventions.columns.interventionType',
      cell: (row) =>
        this.translateService.instant(`interventions.interventionType.${row.interventionType}`),
    },
    {
      key: 'priority',
      headerKey: 'interventions.columns.priority',
      cell: (row) => this.translateService.instant(`interventions.priority.${row.priority}`),
    },
    {
      key: 'status',
      headerKey: 'interventions.columns.status',
      cell: (row) => this.translateService.instant(`interventions.status.${row.status}`),
    },
    {
      key: 'scheduledAt',
      headerKey: 'interventions.columns.scheduledAt',
      cell: (row) => new Date(row.scheduledAt).toLocaleString(),
    },
  ];

  protected readonly data = signal<Intervention[]>([]);
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
    const ref = this.dialog.open(InterventionFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: Intervention): void {
    this.dialog.open(InterventionDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: Intervention): void {
    const ref = this.dialog.open(InterventionFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: Intervention): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'interventions.deleteTitle',
      messageKey: 'interventions.deleteMessage',
      messageParams: { name: row.title },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.interventionService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.interventionService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Title', 'Device', 'Type', 'Priority', 'Status', 'Scheduled at'];
    const rows = all.content.map((row) => [
      row.title,
      row.deviceName,
      row.interventionType,
      row.priority,
      row.status,
      row.scheduledAt,
    ]);
    downloadCsv('interventions.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({
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
