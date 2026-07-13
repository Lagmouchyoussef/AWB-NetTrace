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
import { CarrierCircuitService } from '../../../../core/services/carrier-circuit.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { CarrierCircuit } from './carrier-circuit.model';
import { CarrierCircuitFormDialogComponent } from './carrier-circuit-form-dialog.component';
import { CarrierCircuitDetailDialogComponent } from './carrier-circuit-detail-dialog.component';

@Component({
  selector: 'app-carrier-circuits-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './carrier-circuits-list.component.html',
  styleUrl: './carrier-circuits-list.component.css',
})
export class CarrierCircuitsListComponent implements OnInit {
  private readonly carrierCircuitService = inject(CarrierCircuitService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<CarrierCircuit>[] = [
    { key: 'name', headerKey: 'carrierCircuits.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'carrierCircuits.columns.code', cell: (row) => row.code },
    {
      key: 'connector',
      headerKey: 'carrierCircuits.columns.connector',
      cell: (row) => row.terminatesAtConnector?.name ?? '—',
    },
    {
      key: 'circuitType',
      headerKey: 'carrierCircuits.columns.circuitType',
      cell: (row) =>
        this.translateService.instant(`carrierCircuits.circuitType.${row.circuitType}`),
    },
    { key: 'provider', headerKey: 'carrierCircuits.columns.provider', cell: (row) => row.provider },
    {
      key: 'status',
      headerKey: 'carrierCircuits.columns.status',
      cell: (row) => this.translateService.instant(`carrierCircuits.status.${row.status}`),
    },
  ];

  protected readonly data = signal<CarrierCircuit[]>([]);
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
    const ref = this.dialog.open(CarrierCircuitFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: CarrierCircuit): void {
    this.dialog.open(CarrierCircuitDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: CarrierCircuit): void {
    const ref = this.dialog.open(CarrierCircuitFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: CarrierCircuit): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'carrierCircuits.deleteTitle',
      messageKey: 'carrierCircuits.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.carrierCircuitService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.carrierCircuitService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Connector', 'Circuit Type', 'Provider', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.terminatesAtConnector?.name ?? '',
      row.circuitType,
      row.provider,
      row.status,
    ]);
    downloadCsv('carrier-circuits.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.carrierCircuitService.list({
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
