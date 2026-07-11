import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataTableColumn } from '../../../../core/components/data-table/data-table.model';
import { DataTableComponent } from '../../../../core/components/data-table/data-table.component';
import { AuditorAnomalyDetectionService } from '../../../../core/services/auditor-anomaly-detection.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AnomalyDetection } from '../../../super-admin/pages/anomaly-detections/anomaly-detection.model';
import { AuditorAnomalyDetectionDetailDialogComponent } from './anomaly-detection-detail-dialog.component';

// Read-only compliance signal: an auditor observes anomalies (including UNAUTHORIZED_ACCESS,
// CONFIG_DRIFT) but never acknowledges/resolves them - that stays DC Admin/Network Engineer's
// job. No write mapping exists on AuditorAnomalyDetectionController at all.
@Component({
  selector: 'app-auditor-anomaly-detections-list',
  standalone: true,
  imports: [DataTableComponent, TranslatePipe],
  templateUrl: './anomaly-detections-list.component.html',
  styleUrl: './anomaly-detections-list.component.css',
})
export class AuditorAnomalyDetectionsListComponent implements OnInit {
  private readonly anomalyDetectionService = inject(AuditorAnomalyDetectionService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  protected readonly columns: DataTableColumn<AnomalyDetection>[] = [
    { key: 'title', headerKey: 'anomalyDetections.columns.title', cell: (row) => row.title },
    {
      key: 'deviceName',
      headerKey: 'anomalyDetections.columns.device',
      cell: (row) => row.deviceName,
    },
    {
      key: 'anomalyType',
      headerKey: 'anomalyDetections.columns.anomalyType',
      cell: (row) =>
        this.translateService.instant(`anomalyDetections.anomalyType.${row.anomalyType}`),
    },
    {
      key: 'severity',
      headerKey: 'anomalyDetections.columns.severity',
      cell: (row) => this.translateService.instant(`anomalyDetections.severity.${row.severity}`),
    },
    {
      key: 'status',
      headerKey: 'anomalyDetections.columns.status',
      cell: (row) => this.translateService.instant(`anomalyDetections.status.${row.status}`),
    },
    {
      key: 'detectedAt',
      headerKey: 'anomalyDetections.columns.detectedAt',
      cell: (row) => new Date(row.detectedAt).toLocaleString(),
    },
  ];

  protected readonly data = signal<AnomalyDetection[]>([]);
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

  protected onView(row: AnomalyDetection): void {
    this.dialog.open(AuditorAnomalyDetectionDetailDialogComponent, { width: '480px', data: row });
  }

  protected async onExportCsv(): Promise<void> {
    const all = await this.anomalyDetectionService.list({
      page: 0,
      size: 10000,
      search: this.searchQuery,
    });
    const header = ['Title', 'Device', 'Type', 'Severity', 'Status', 'Detected at'];
    const rows = all.content.map((row) => [
      row.title,
      row.deviceName,
      row.anomalyType,
      row.severity,
      row.status,
      row.detectedAt,
    ]);
    downloadCsv('anomaly-detections.csv', header, rows);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.anomalyDetectionService.list({
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
