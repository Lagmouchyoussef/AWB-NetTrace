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
import { DcAdminOverlayTunnelService } from '../../../../core/services/dc-admin-overlay-tunnel.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { OverlayTunnel } from '../../../super-admin/pages/overlay-tunnels/overlay-tunnel.model';
import { DcAdminOverlayTunnelFormDialogComponent } from './overlay-tunnel-form-dialog.component';
import { DcAdminOverlayTunnelDetailDialogComponent } from './overlay-tunnel-detail-dialog.component';

@Component({
  selector: 'app-dc-admin-overlay-tunnels-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './overlay-tunnels-list.component.html',
  styleUrl: './overlay-tunnels-list.component.css',
})
export class DcAdminOverlayTunnelsListComponent implements OnInit {
  private readonly overlayTunnelService = inject(DcAdminOverlayTunnelService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<OverlayTunnel>[] = [
    { key: 'name', headerKey: 'overlayTunnels.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'overlayTunnels.columns.code', cell: (row) => row.code },
    {
      key: 'sourceEdgeName',
      headerKey: 'overlayTunnels.columns.source',
      cell: (row) => row.sourceEdgeName,
    },
    {
      key: 'targetEdgeName',
      headerKey: 'overlayTunnels.columns.target',
      cell: (row) => row.targetEdgeName,
    },
    {
      key: 'tunnelType',
      headerKey: 'overlayTunnels.columns.tunnelType',
      cell: (row) => this.translateService.instant(`overlayTunnels.tunnelType.${row.tunnelType}`),
    },
    {
      key: 'status',
      headerKey: 'overlayTunnels.columns.status',
      cell: (row) => this.translateService.instant(`overlayTunnels.status.${row.status}`),
    },
  ];

  protected readonly data = signal<OverlayTunnel[]>([]);
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
    const ref = this.dialog.open(DcAdminOverlayTunnelFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: OverlayTunnel): void {
    this.dialog.open(DcAdminOverlayTunnelDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: OverlayTunnel): void {
    const ref = this.dialog.open(DcAdminOverlayTunnelFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: OverlayTunnel): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'overlayTunnels.deleteTitle',
      messageKey: 'overlayTunnels.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.overlayTunnelService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.overlayTunnelService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Source', 'Target', 'Tunnel Type', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.sourceEdgeName,
      row.targetEdgeName,
      row.tunnelType,
      row.status,
    ]);
    downloadCsv('overlay-tunnels.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.overlayTunnelService.list({
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
