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
import { AnomalyDetectionService } from '../../../../core/services/anomaly-detection.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { AnomalyDetection } from './anomaly-detection.model';
import { AnomalyDetectionFormDialogComponent } from './anomaly-detection-form-dialog.component';
import { AnomalyDetectionDetailDialogComponent } from './anomaly-detection-detail-dialog.component';

@Component({
  selector: 'app-anomaly-detections-list',
  standalone: true,
  imports: [DataTableComponent, MatIconModule, TranslatePipe],
  templateUrl: './anomaly-detections-list.component.html',
  styleUrl: './anomaly-detections-list.component.css',
})
export class AnomalyDetectionsListComponent implements OnInit {
  private readonly anomalyDetectionService = inject(AnomalyDetectionService);
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

  protected onCreate(): void {
    const ref = this.dialog.open(AnomalyDetectionFormDialogComponent, {
      width: '560px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected onView(row: AnomalyDetection): void {
    this.dialog.open(AnomalyDetectionDetailDialogComponent, { width: '480px', data: row });
  }

  protected onEdit(row: AnomalyDetection): void {
    const ref = this.dialog.open(AnomalyDetectionFormDialogComponent, {
      width: '560px',
      data: row,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.load();
      }
    });
  }

  protected async onDelete(row: AnomalyDetection): Promise<void> {
    const confirmData: ConfirmDialogData = {
      titleKey: 'anomalyDetections.deleteTitle',
      messageKey: 'anomalyDetections.deleteMessage',
      messageParams: { name: row.title },
      confirmKey: 'common.delete',
      danger: true,
    };
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: confirmData });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (confirmed) {
      await this.anomalyDetectionService.delete(row.id);
      this.load();
    }
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
