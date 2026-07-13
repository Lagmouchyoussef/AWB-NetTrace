import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { DcAdminEquipmentTypeService } from '../../../../core/services/dc-admin-equipment-type.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { EquipmentType } from '../../../super-admin/pages/equipment-types/equipment-type.model';
import { DcAdminEquipmentTypeDetailDialogComponent } from './equipment-type-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-equipment-types-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './equipment-types-list.component.html',
  styleUrl: './equipment-types-list.component.css',
})
export class DcAdminEquipmentTypesListComponent implements OnInit {
  private readonly equipmentTypeService = inject(DcAdminEquipmentTypeService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<EquipmentType>[] = [
    { key: 'name', headerKey: 'equipmentTypes.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'equipmentTypes.columns.code', cell: (row) => row.code },
    {
      key: 'category',
      headerKey: 'equipmentTypes.columns.category',
      cell: (row) => this.translateService.instant(`equipmentTypes.category.${row.category}`),
    },
    {
      key: 'manufacturer',
      headerKey: 'equipmentTypes.columns.manufacturer',
      cell: (row) => row.manufacturer ?? '',
    },
    {
      key: 'vendor',
      headerKey: 'equipmentTypes.columns.vendor',
      cell: (row) => row.vendor ?? '',
    },
    {
      key: 'version',
      headerKey: 'equipmentTypes.columns.version',
      cell: (row) => row.version ?? '',
    },
    {
      key: 'status',
      headerKey: 'equipmentTypes.columns.status',
      cell: (row) => this.translateService.instant(`equipmentTypes.status.${row.status}`),
    },
  ];

  protected readonly data = signal<EquipmentType[]>([]);
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

  protected onView(row: EquipmentType): void {
    this.dialog.open(DcAdminEquipmentTypeDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.equipmentTypeService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Category', 'Manufacturer', 'Vendor', 'Version', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.category,
      row.manufacturer ?? '',
      row.vendor ?? '',
      row.version ?? '',
      row.status,
    ]);
    downloadCsv('equipment-types.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.equipmentTypeService.list({
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
