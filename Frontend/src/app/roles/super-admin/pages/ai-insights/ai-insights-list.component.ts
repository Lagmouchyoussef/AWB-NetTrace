import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { AiInsightService } from '../../../../core/services/ai-insight.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AiInsight } from './ai-insight.model';
import { AiInsightDetailDialogComponent } from './ai-insight-detail-dialog.component';

@Component({
  selector: 'app-ai-insights-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './ai-insights-list.component.html',
  styleUrl: './ai-insights-list.component.css',
})
export class AiInsightsListComponent implements OnInit {
  private readonly aiInsightService = inject(AiInsightService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<AiInsight>[] = [
    { key: 'title', headerKey: 'aiInsights.columns.title', cell: (row) => row.title },
    {
      key: 'insightType',
      headerKey: 'aiInsights.columns.type',
      cell: (row) => this.translateService.instant(`aiInsights.type.${row.insightType}`),
    },
    {
      key: 'severity',
      headerKey: 'aiInsights.columns.severity',
      cell: (row) => this.translateService.instant(`aiInsights.severity.${row.severity}`),
    },
    {
      key: 'status',
      headerKey: 'aiInsights.columns.status',
      cell: (row) => this.translateService.instant(`aiInsights.status.${row.status}`),
    },
    {
      key: 'entityName',
      headerKey: 'aiInsights.columns.entity',
      cell: (row) => row.entityName ?? '—',
    },
    {
      key: 'createdAt',
      headerKey: 'aiInsights.columns.createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  protected readonly data = signal<AiInsight[]>([]);
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

  protected onView(row: AiInsight): void {
    const ref = this.dialog.open(AiInsightDetailDialogComponent, { width: '520px', data: row });
    ref.afterClosed().subscribe((changed) => {
      if (changed) {
        this.load();
      }
    });
  }

  protected async onDismiss(row: AiInsight): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'aiInsights.dismissTitle',
      messageKey: 'aiInsights.dismissMessage',
      messageParams: { title: row.title },
      confirmKey: 'aiInsights.dismiss',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.aiInsightService.dismiss(row.id);
      this.load();
    }
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.aiInsightService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Title', 'Type', 'Severity', 'Status', 'Entity', 'Created at'];
    const rows = all.content.map((row) => [
      row.title,
      row.insightType,
      row.severity,
      row.status,
      row.entityName ?? '',
      row.createdAt,
    ]);
    downloadCsv('ai-insights.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.aiInsightService.list({
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
