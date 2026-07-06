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
import { RolePermissionService } from '../../../../core/services/role-permission.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { RolePermission } from './role-permission.model';
import { RolePermissionFormDialogComponent } from './role-permission-form-dialog.component';
import { RolePermissionDetailDialogComponent } from './role-permission-detail-dialog.component';

@Component({
  selector: 'app-role-permissions-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './role-permissions-list.component.html',
  styleUrl: './role-permissions-list.component.css',
})
export class RolePermissionsListComponent implements OnInit {
  private readonly rolePermissionService = inject(RolePermissionService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<RolePermission>[] = [
    {
      key: 'role',
      headerKey: 'rolePermissions.columns.role',
      cell: (row) => this.translateService.instant(`users.role.${row.role}`),
    },
    {
      key: 'permissionName',
      headerKey: 'rolePermissions.columns.permission',
      cell: (row) => row.permissionName,
    },
    {
      key: 'granted',
      headerKey: 'rolePermissions.columns.granted',
      cell: (row) =>
        this.translateService.instant(row.granted ? 'users.enabledYes' : 'users.enabledNo'),
    },
  ];

  protected readonly data = signal<RolePermission[]>([]);
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
    const ref = this.dialog.open(RolePermissionFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: RolePermission): void {
    this.dialog.open(RolePermissionDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: RolePermission): void {
    const ref = this.dialog.open(RolePermissionFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: RolePermission): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'rolePermissions.deleteTitle',
      messageKey: 'rolePermissions.deleteMessage',
      messageParams: { name: row.permissionName },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.rolePermissionService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.rolePermissionService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Role', 'Permission', 'Granted'];
    const rows = all.content.map((row) => [row.role, row.permissionName, String(row.granted)]);
    downloadCsv('role-permissions.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.rolePermissionService.list({
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
