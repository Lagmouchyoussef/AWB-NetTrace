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
import { UserManagementService } from '../../../../core/services/user-management.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AppUser } from './user.model';
import { UserFormDialogComponent } from './user-form-dialog.component';
import { UserDetailDialogComponent } from './user-detail-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent implements OnInit {
  private readonly userManagementService = inject(UserManagementService);
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

  protected onCreate(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: AppUser): void {
    this.dialog.open(UserDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: AppUser): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: AppUser): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'users.deleteTitle',
      messageKey: 'users.deleteMessage',
      messageParams: { name: row.username },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.userManagementService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.userManagementService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Username', 'Role', 'Enabled', 'IP Restriction'];
    const rows = all.content.map((row) => [
      row.username,
      row.role,
      String(row.enabled),
      String(row.ipRestrictionEnabled),
    ]);
    downloadCsv('users.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.userManagementService.list({
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
