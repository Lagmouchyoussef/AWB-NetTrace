import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../../core/components/data-table/data-table.component';
import { NetworkEngineerTechnologyCatalogService } from '../../../../../core/services/network-engineer-technology-catalog.service';
import { downloadCsv } from '../../../../../core/utils/csv-export';
import { TechnologyCatalogEntry } from '../../../../super-admin/pages/technology-catalog/technology-catalog-entry.model';
import { NeTechnologyCatalogFormDialogComponent } from './technology-catalog-form-dialog.component';
import { NeTechnologyCatalogDetailDialogComponent } from './technology-catalog-detail-dialog.component';

// Create/edit allowed, no delete - decommission via status.
@Component({
  selector: 'app-ne-technology-catalog-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './technology-catalog-list.component.html',
  styleUrl: './technology-catalog-list.component.css',
})
export class NeTechnologyCatalogListComponent implements OnInit {
  private readonly technologyCatalogService = inject(NetworkEngineerTechnologyCatalogService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<TechnologyCatalogEntry>[] = [
    { key: 'name', headerKey: 'technologyCatalog.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'technologyCatalog.columns.code', cell: (row) => row.code },
    {
      key: 'category',
      headerKey: 'technologyCatalog.columns.category',
      cell: (row) => this.translateService.instant(`technologyCatalog.category.${row.category}`),
    },
    {
      key: 'vendor',
      headerKey: 'technologyCatalog.columns.vendor',
      cell: (row) => row.vendor ?? '',
    },
    {
      key: 'status',
      headerKey: 'technologyCatalog.columns.status',
      cell: (row) => this.translateService.instant(`technologyCatalog.status.${row.status}`),
    },
  ];

  protected readonly data = signal<TechnologyCatalogEntry[]>([]);
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
    const ref = this.dialog.open(NeTechnologyCatalogFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: TechnologyCatalogEntry): void {
    this.dialog.open(NeTechnologyCatalogDetailDialogComponent, {
      width: '480px',
      data: row,
    });
  }

  protected onEdit(row: TechnologyCatalogEntry): void {
    const ref = this.dialog.open(NeTechnologyCatalogFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.technologyCatalogService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Category', 'Vendor', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.category,
      row.vendor ?? '',
      row.status,
    ]);
    downloadCsv('technology-catalog.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.technologyCatalogService.list({
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
