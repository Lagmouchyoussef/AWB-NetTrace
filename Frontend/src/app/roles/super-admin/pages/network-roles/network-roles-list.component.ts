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
import { NetworkRoleService } from '../../../../core/services/network-role.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { NetworkRole } from './network-role.model';
import { NetworkRoleFormDialogComponent } from './network-role-form-dialog.component';
import { NetworkRoleDetailDialogComponent } from './network-role-detail-dialog.component';

@Component({
  selector: 'app-network-roles-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './network-roles-list.component.html',
  styleUrl: './network-roles-list.component.css',
})
export class NetworkRolesListComponent implements OnInit {
  private readonly networkRoleService = inject(NetworkRoleService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<NetworkRole>[] = [
    { key: 'name', headerKey: 'networkRoles.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'networkRoles.columns.code', cell: (row) => row.code },
    { key: 'deviceName', headerKey: 'networkRoles.columns.device', cell: (row) => row.deviceName },
    {
      key: 'roleType',
      headerKey: 'networkRoles.columns.roleType',
      cell: (row) => this.translateService.instant(`networkRoles.roleType.${row.roleType}`),
    },
    {
      key: 'asn',
      headerKey: 'networkRoles.columns.asn',
      cell: (row) => (row.asn !== null ? String(row.asn) : ''),
    },
    {
      key: 'status',
      headerKey: 'networkRoles.columns.status',
      cell: (row) => this.translateService.instant(`networkRoles.status.${row.status}`),
    },
  ];

  protected readonly data = signal<NetworkRole[]>([]);
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
    const ref = this.dialog.open(NetworkRoleFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: NetworkRole): void {
    this.dialog.open(NetworkRoleDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: NetworkRole): void {
    const ref = this.dialog.open(NetworkRoleFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: NetworkRole): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'networkRoles.deleteTitle',
      messageKey: 'networkRoles.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.networkRoleService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.networkRoleService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Device', 'Role Type', 'ASN', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.deviceName,
      row.roleType,
      row.asn ?? '',
      row.status,
    ]);
    downloadCsv('network-roles.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.networkRoleService.list({
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
