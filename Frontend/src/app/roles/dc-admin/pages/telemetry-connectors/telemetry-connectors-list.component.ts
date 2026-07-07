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
import { DcAdminTelemetryConnectorService } from '../../../../core/services/dc-admin-telemetry-connector.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { TelemetryConnector } from '../../../super-admin/pages/telemetry-connectors/telemetry-connector.model';
import { DcAdminTelemetryConnectorFormDialogComponent } from './telemetry-connector-form-dialog.component';
import { DcAdminTelemetryConnectorDetailDialogComponent } from './telemetry-connector-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-telemetry-connectors-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './telemetry-connectors-list.component.html',
  styleUrl: './telemetry-connectors-list.component.css',
})
export class DcAdminTelemetryConnectorsListComponent implements OnInit {
  private readonly telemetryConnectorService = inject(DcAdminTelemetryConnectorService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<TelemetryConnector>[] = [
    { key: 'name', headerKey: 'telemetryConnectors.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'telemetryConnectors.columns.code', cell: (row) => row.code },
    {
      key: 'deviceName',
      headerKey: 'telemetryConnectors.columns.device',
      cell: (row) => row.deviceName,
    },
    {
      key: 'protocol',
      headerKey: 'telemetryConnectors.columns.protocol',
      cell: (row) => this.translateService.instant(`telemetryConnectors.protocol.${row.protocol}`),
    },
    {
      key: 'status',
      headerKey: 'telemetryConnectors.columns.status',
      cell: (row) => this.translateService.instant(`telemetryConnectors.status.${row.status}`),
    },
  ];

  protected readonly data = signal<TelemetryConnector[]>([]);
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
    const ref = this.dialog.open(DcAdminTelemetryConnectorFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: TelemetryConnector): void {
    this.dialog.open(DcAdminTelemetryConnectorDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: TelemetryConnector): void {
    const ref = this.dialog.open(DcAdminTelemetryConnectorFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: TelemetryConnector): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'telemetryConnectors.deleteTitle',
      messageKey: 'telemetryConnectors.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.telemetryConnectorService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.telemetryConnectorService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Device', 'Protocol', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.deviceName,
      row.protocol,
      row.status,
    ]);
    downloadCsv('telemetry-connectors.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.telemetryConnectorService.list({
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
