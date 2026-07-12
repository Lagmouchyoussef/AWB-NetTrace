import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorUserService } from '../../../../core/services/auditor-user.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AppUser } from '../../../super-admin/pages/users/user.model';
import { AuditorUserDetailDialogComponent } from './user-detail-dialog.component';

// Access-review directory - read-only, no create/edit/delete affordance anywhere (see
// AuditorUserController: GET-only backend).
@Component({
  selector: 'app-auditor-users-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class AuditorUsersListComponent implements OnInit {
  private readonly userService = inject(AuditorUserService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<AppUser>[] = [
    { key: 'username', headerKey: 'users.columns.username', cell: (row) => row.username },
    {
      key: 'role',
      headerKey: 'users.columns.role',
      cell: (row) => this.translateService.instant(`users.role.${row.role}`),
    },
    {
      key: 'enabled',
      headerKey: 'users.columns.enabled',
      cell: (row) =>
        this.translateService.instant(row.enabled ? 'users.enabledYes' : 'users.enabledNo'),
    },
    {
      key: 'ipRestrictionEnabled',
      headerKey: 'users.columns.ipRestrictionEnabled',
      cell: (row) =>
        this.translateService.instant(
          row.ipRestrictionEnabled ? 'users.enabledYes' : 'users.enabledNo',
        ),
    },
    {
      key: 'createdAt',
      headerKey: 'auditor.users.createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  protected readonly data = signal<AppUser[]>([]);
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

  protected onView(row: AppUser): void {
    this.dialog.open(AuditorUserDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.userService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Username', 'Role', 'Enabled', 'IP Restriction', 'Created At'];
    const rows = all.content.map((row) => [
      row.username,
      row.role,
      String(row.enabled),
      String(row.ipRestrictionEnabled),
      row.createdAt,
    ]);
    downloadCsv('user-directory.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.userService.list({
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
