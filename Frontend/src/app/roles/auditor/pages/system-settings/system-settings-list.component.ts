import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorSystemSettingService } from '../../../../core/services/auditor-system-setting.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { SystemSetting } from '../../../super-admin/pages/system-settings/system-setting.model';
import { AuditorSystemSettingDetailDialogComponent } from './system-setting-detail-dialog.component';

// Configuration review - read-only, no create/edit/delete affordance anywhere (see
// AuditorSystemSettingController: GET-only backend).
@Component({
  selector: 'app-auditor-system-settings-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './system-settings-list.component.html',
  styleUrl: './system-settings-list.component.css',
})
export class AuditorSystemSettingsListComponent implements OnInit {
  private readonly systemSettingService = inject(AuditorSystemSettingService);
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

  protected onView(row: SystemSetting): void {
    this.dialog.open(AuditorSystemSettingDetailDialogComponent, { width: '480px', data: row });
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
