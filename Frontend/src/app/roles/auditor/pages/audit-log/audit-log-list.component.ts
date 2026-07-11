import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorAuditLogService } from '../../../../core/services/auditor-audit-log.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AuditLog } from '../../../super-admin/pages/audit-logs/audit-log.model';
import { AuditorAuditLogDetailDialogComponent } from './audit-log-detail-dialog.component';

// Independent oversight, whole system, forever immutable from this screen: no create/edit/delete
// affordance at all (readOnly on the table hides them, and the backend controller has no write
// mapping regardless - see AuditorAuditLogController). This is the flagship screen of this role.
@Component({
  selector: 'app-auditor-audit-log-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './audit-log-list.component.html',
  styleUrl: './audit-log-list.component.css',
})
export class AuditorAuditLogListComponent implements OnInit {
  private readonly auditLogService = inject(AuditorAuditLogService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<AuditLog>[] = [
    {
      key: 'occurredAt',
      headerKey: 'auditLogs.columns.occurredAt',
      cell: (row) => new Date(row.occurredAt).toLocaleString(),
    },
    {
      key: 'actorUsername',
      headerKey: 'auditLogs.columns.actorUsername',
      cell: (row) => row.actorUsername,
    },
    {
      key: 'action',
      headerKey: 'auditLogs.columns.action',
      cell: (row) => this.translateService.instant(`auditLogs.action.${row.action}`),
    },
    { key: 'entityType', headerKey: 'auditLogs.columns.entityType', cell: (row) => row.entityType },
    {
      key: 'entityReference',
      headerKey: 'auditLogs.columns.entityReference',
      cell: (row) => row.entityReference ?? '',
    },
  ];

  protected readonly data = signal<AuditLog[]>([]);
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

  protected onView(row: AuditLog): void {
    this.dialog.open(AuditorAuditLogDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.auditLogService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Occurred At', 'Actor', 'Action', 'Entity Type', 'Entity Reference'];
    const rows = all.content.map((row) => [
      row.occurredAt,
      row.actorUsername,
      row.action,
      row.entityType,
      row.entityReference ?? '',
    ]);
    downloadCsv('audit-logs.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.auditLogService.list({
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
