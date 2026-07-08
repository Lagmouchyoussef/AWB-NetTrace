import { Component, computed, input, output, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { DataTableColumn } from './data-table.model';
import { TranslatedPaginatorIntl } from './translated-paginator-intl';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: TranslatedPaginatorIntl }],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly data = input.required<T[]>();
  readonly totalCount = input.required<number>();
  readonly loading = input<boolean>(false);
  readonly pageSize = input<number>(10);
  readonly searchable = input<boolean>(true);
  readonly readOnly = input<boolean>(false);
  // Shows Edit but hides Delete - for roles that may modify an entity but never hard-delete it
  // (e.g. Network Engineer, which decommissions via a status change instead). Independent of
  // readOnly, which hides both.
  readonly hideDelete = input<boolean>(false);
  // Optional extra row action rendered between Edit and Delete - e.g. Network Engineer's
  // "Decommission" on cables, a status change rather than a hard delete. Only rendered when
  // both icon and label are provided.
  readonly customActionIcon = input<string | undefined>(undefined);
  readonly customActionLabelKey = input<string | undefined>(undefined);

  readonly page = output<PageEvent>();
  readonly sortChange = output<Sort>();
  readonly searchChange = output<string>();
  readonly view = output<T>();
  readonly edit = output<T>();
  readonly delete = output<T>();
  readonly customAction = output<T>();
  readonly exportCsv = output<void>();

  protected readonly displayedColumns = computed<string[]>(() => [
    ...this.columns().map((column) => column.key),
    'actions',
  ]);
  protected readonly skeletonRows = computed(() => Array.from({ length: this.pageSize() }));

  protected readonly searchQuery = signal('');

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchChange.emit(value);
  }

  protected onPage(event: PageEvent): void {
    this.page.emit(event);
  }

  protected onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  protected sortHeaderId(column: DataTableColumn<T>): string {
    return column.sortable === false ? '' : column.key;
  }
}
