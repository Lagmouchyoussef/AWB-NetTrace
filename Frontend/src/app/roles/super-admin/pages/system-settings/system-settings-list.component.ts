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
import { SystemSettingService } from '../../../../core/services/system-setting.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { SystemSetting } from './system-setting.model';
import { SystemSettingFormDialogComponent } from './system-setting-form-dialog.component';
import { SystemSettingDetailDialogComponent } from './system-setting-detail-dialog.component';

@Component({
  selector: 'app-system-settings-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './system-settings-list.component.html',
  styleUrl: './system-settings-list.component.css',
})
export class SystemSettingsListComponent implements OnInit {
  private readonly systemSettingService = inject(SystemSettingService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<SystemSetting>[] = [
    {
      key: 'settingKey',
      headerKey: 'systemSettings.columns.settingKey',
      cell: (row) => row.settingKey,
    },
    {
      key: 'settingValue',
      headerKey: 'systemSettings.columns.settingValue',
      cell: (row) => row.settingValue ?? '',
    },
    {
      key: 'category',
      headerKey: 'systemSettings.columns.category',
      cell: (row) => this.translateService.instant(`systemSettings.category.${row.category}`),
    },
    {
      key: 'dataType',
      headerKey: 'systemSettings.columns.dataType',
      cell: (row) => this.translateService.instant(`systemSettings.dataType.${row.dataType}`),
    },
  ];

  protected readonly data = signal<SystemSetting[]>([]);
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
    const ref = this.dialog.open(SystemSettingFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: SystemSetting): void {
    this.dialog.open(SystemSettingDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: SystemSetting): void {
    const ref = this.dialog.open(SystemSettingFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: SystemSetting): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'systemSettings.deleteTitle',
      messageKey: 'systemSettings.deleteMessage',
      messageParams: { name: row.settingKey },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.systemSettingService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.systemSettingService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Key', 'Value', 'Category', 'Data Type'];
    const rows = all.content.map((row) => [
      row.settingKey,
      row.settingValue ?? '',
      row.category,
      row.dataType,
    ]);
    downloadCsv('system-settings.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.systemSettingService.list({
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
