import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorRolePermissionService } from '../../../../core/services/auditor-role-permission.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { RolePermission } from '../../../super-admin/pages/role-permissions/role-permission.model';
import { AuditorRolePermissionDetailDialogComponent } from './role-permission-detail-dialog.component';

// Privilege review - read-only, no create/edit/delete affordance anywhere (see
// AuditorRolePermissionController: GET-only backend).
@Component({
  selector: 'app-auditor-role-permissions-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './role-permissions-list.component.html',
  styleUrl: './role-permissions-list.component.css',
})
export class AuditorRolePermissionsListComponent implements OnInit {
  private readonly rolePermissionService = inject(AuditorRolePermissionService);
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
    {
      key: 'notes',
      headerKey: 'auditor.rolePermissions.notes',
      cell: (row) => row.notes ?? '',
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

  protected onView(row: RolePermission): void {
    this.dialog.open(AuditorRolePermissionDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.rolePermissionService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Role', 'Permission', 'Granted', 'Notes'];
    const rows = all.content.map((row) => [
      row.role,
      row.permissionName,
      String(row.granted),
      row.notes ?? '',
    ]);
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
