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
import { IntegrationConnectorService } from '../../../../core/services/integration-connector.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { IntegrationConnector } from './integration-connector.model';
import { IntegrationConnectorFormDialogComponent } from './integration-connector-form-dialog.component';
import { IntegrationConnectorDetailDialogComponent } from './integration-connector-detail-dialog.component';

@Component({
  selector: 'app-integration-connectors-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './integration-connectors-list.component.html',
  styleUrl: './integration-connectors-list.component.css',
})
export class IntegrationConnectorsListComponent implements OnInit {
  private readonly integrationConnectorService = inject(IntegrationConnectorService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<IntegrationConnector>[] = [
    { key: 'name', headerKey: 'integrationConnectors.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'integrationConnectors.columns.code', cell: (row) => row.code },
    {
      key: 'deviceName',
      headerKey: 'integrationConnectors.columns.device',
      cell: (row) => row.deviceName,
    },
    {
      key: 'protocol',
      headerKey: 'integrationConnectors.columns.protocol',
      cell: (row) =>
        this.translateService.instant(`integrationConnectors.protocol.${row.protocol}`),
    },
    {
      key: 'automationType',
      headerKey: 'integrationConnectors.columns.automationType',
      cell: (row) =>
        this.translateService.instant(`integrationConnectors.automationType.${row.automationType}`),
    },
    {
      key: 'status',
      headerKey: 'integrationConnectors.columns.status',
      cell: (row) => this.translateService.instant(`integrationConnectors.status.${row.status}`),
    },
  ];

  protected readonly data = signal<IntegrationConnector[]>([]);
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
    const ref = this.dialog.open(IntegrationConnectorFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: IntegrationConnector): void {
    this.dialog.open(IntegrationConnectorDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: IntegrationConnector): void {
    const ref = this.dialog.open(IntegrationConnectorFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: IntegrationConnector): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'integrationConnectors.deleteTitle',
      messageKey: 'integrationConnectors.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.integrationConnectorService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.integrationConnectorService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Device', 'Protocol', 'Automation Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.deviceName,
      row.protocol,
      row.automationType,
      row.status,
    ]);
    downloadCsv('integration-connectors.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.integrationConnectorService.list({
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
