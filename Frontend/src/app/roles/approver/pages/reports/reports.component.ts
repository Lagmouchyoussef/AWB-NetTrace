import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { downloadCsv } from '../../../../core/utils/csv-export';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

const FETCH_SIZE = 1000;

// Real statistics computed from this approver's own decision history, over a selectable period -
// plus a genuine CSV export (core/utils/csv-export.ts, already used elsewhere in the app). No PDF
// generation: nothing in this codebase generates files server-side (the existing "ReportController"
// is a metadata catalog, not a rendering engine) - CSV of real decisions beats a fabricated format.
@Component({
  selector: 'app-approver-reports',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverReportsComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);
  private readonly translateService = inject(TranslateService);

  protected readonly loading = signal(true);
  protected readonly allDecisions = signal<Intervention[]>([]);
  protected readonly daysRange = signal(30);

  protected readonly periodDecisions = computed(() => {
    const cutoff = Date.now() - this.daysRange() * 24 * 60 * 60 * 1000;
    return this.allDecisions().filter((d) => d.decidedAt && new Date(d.decidedAt).getTime() >= cutoff);
  });

  protected readonly approvedCount = computed(
    () => this.periodDecisions().filter((d) => d.approvalStatus === 'APPROVED').length,
  );
  protected readonly rejectedCount = computed(
    () => this.periodDecisions().filter((d) => d.approvalStatus === 'REJECTED').length,
  );
  protected readonly approvalRate = computed(() => {
    const total = this.periodDecisions().length;
    return total === 0 ? 0 : Math.round((this.approvedCount() / total) * 1000) / 10;
  });
  protected readonly avgDecisionHours = computed(() => {
    const items = this.periodDecisions().filter((d) => d.decidedAt);
    if (items.length === 0) {
      return 0;
    }
    const totalHours = items.reduce((sum, d) => {
      const created = new Date(d.createdAt).getTime();
      const decided = new Date(d.decidedAt as string).getTime();
      return sum + (decided - created) / (1000 * 60 * 60);
    }, 0);
    return Math.round((totalHours / items.length) * 10) / 10;
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.listDecisions({
        page: 0,
        size: FETCH_SIZE,
        sort: 'decidedAt,desc',
      });
      this.allDecisions.set(result.content);
    } finally {
      this.loading.set(false);
    }
  }

  protected setDaysRange(days: number): void {
    this.daysRange.set(days);
  }

  protected onExportCsv(): void {
    const header = [
      this.translateService.instant('interventions.columns.title'),
      this.translateService.instant('interventions.fields.device'),
      this.translateService.instant('approver.allInterventions.approvalStatus'),
      this.translateService.instant('interventions.approvalQueue.requestedBy'),
      this.translateService.instant('approver.reports.decidedAt'),
      this.translateService.instant('interventions.approvalQueue.rejectCommentLabel'),
    ];
    const rows = this.periodDecisions().map((d) => [
      d.title,
      d.deviceName,
      this.translateService.instant(`interventions.approvalStatus.${d.approvalStatus}`),
      d.requestedByUsername ?? '',
      d.decidedAt ?? '',
      d.approvalComment ?? '',
    ]);
    downloadCsv(`approver-decisions-${this.daysRange()}d.csv`, header, rows);
  }
}
