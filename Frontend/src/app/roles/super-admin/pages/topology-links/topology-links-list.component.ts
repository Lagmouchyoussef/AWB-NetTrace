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
import { TopologyLinkService } from '../../../../core/services/topology-link.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { TopologyLink } from './topology-link.model';
import { TopologyLinkFormDialogComponent } from './topology-link-form-dialog.component';
import { TopologyLinkDetailDialogComponent } from './topology-link-detail-dialog.component';

@Component({
  selector: 'app-topology-links-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './topology-links-list.component.html',
  styleUrl: './topology-links-list.component.css',
})
export class TopologyLinksListComponent implements OnInit {
  private readonly topologyLinkService = inject(TopologyLinkService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<TopologyLink>[] = [
    { key: 'name', headerKey: 'topologyLinks.columns.name', cell: (row) => row.name },
    { key: 'code', headerKey: 'topologyLinks.columns.code', cell: (row) => row.code },
    {
      key: 'sourceRoleName',
      headerKey: 'topologyLinks.columns.source',
      cell: (row) => row.sourceRoleName,
    },
    {
      key: 'targetRoleName',
      headerKey: 'topologyLinks.columns.target',
      cell: (row) => row.targetRoleName,
    },
    {
      key: 'linkType',
      headerKey: 'topologyLinks.columns.linkType',
      cell: (row) => this.translateService.instant(`topologyLinks.linkType.${row.linkType}`),
    },
    {
      key: 'speedGbps',
      headerKey: 'topologyLinks.columns.speedGbps',
      cell: (row) => `${row.speedGbps} Gbps`,
    },
    {
      key: 'status',
      headerKey: 'topologyLinks.columns.status',
      cell: (row) => this.translateService.instant(`topologyLinks.status.${row.status}`),
    },
  ];

  protected readonly data = signal<TopologyLink[]>([]);
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
    const ref = this.dialog.open(TopologyLinkFormDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: TopologyLink): void {
    this.dialog.open(TopologyLinkDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: TopologyLink): void {
    const ref = this.dialog.open(TopologyLinkFormDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: TopologyLink): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'topologyLinks.deleteTitle',
      messageKey: 'topologyLinks.deleteMessage',
      messageParams: { name: row.name },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.topologyLinkService.delete(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.topologyLinkService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Name', 'Code', 'Source', 'Target', 'Link Type', 'Speed (Gbps)', 'Status'];
    const rows = all.content.map((row) => [
      row.name,
      row.code,
      row.sourceRoleName,
      row.targetRoleName,
      row.linkType,
      row.speedGbps,
      row.status,
    ]);
    downloadCsv('topology-links.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.topologyLinkService.list({
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
