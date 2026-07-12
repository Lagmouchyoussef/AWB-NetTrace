import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApproverInterventionService } from '../../../../core/services/approver-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

interface CalendarDay {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  interventions: Intervention[];
}

const PAGE_SIZE = 500;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Hand-rolled month grid (no calendar library, same "no new dependency" philosophy as
// StatChartComponent's own hand-rolled SVG charts) showing only APPROVED interventions - lets the
// Approver spot scheduling conflicts before approving a new request that overlaps an already
// validated one. Fetches once (a generous page of already-decided APPROVED items) and does all
// month navigation/grouping client-side, same approach as the technician schedule screen.
@Component({
  selector: 'app-approver-calendar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverCalendarComponent implements OnInit {
  private readonly interventionService = inject(ApproverInterventionService);

  protected readonly loading = signal(true);
  protected readonly approved = signal<Intervention[]>([]);
  protected readonly viewMonth = signal(startOfMonth(new Date()));

  protected readonly monthLabel = computed(() => {
    const d = this.viewMonth();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  protected readonly days = computed<CalendarDay[]>(() => {
    const monthStart = this.viewMonth();
    const gridStart = startOfWeek(monthStart);
    const byDate = this.groupByDate();
    const todayKey = toDateKey(new Date());
    const days: CalendarDay[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      const dateKey = toDateKey(date);
      days.push({
        date,
        dateKey,
        inCurrentMonth: date.getMonth() === monthStart.getMonth(),
        isToday: dateKey === todayKey,
        interventions: byDate.get(dateKey) ?? [],
      });
    }
    return days;
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({
        page: 0,
        size: PAGE_SIZE,
        approvalStatus: 'APPROVED',
      });
      this.approved.set(result.content);
    } finally {
      this.loading.set(false);
    }
  }

  protected onPreviousMonth(): void {
    const d = new Date(this.viewMonth());
    d.setMonth(d.getMonth() - 1);
    this.viewMonth.set(d);
  }

  protected onNextMonth(): void {
    const d = new Date(this.viewMonth());
    d.setMonth(d.getMonth() + 1);
    this.viewMonth.set(d);
  }

  protected onToday(): void {
    this.viewMonth.set(startOfMonth(new Date()));
  }

  private groupByDate(): Map<string, Intervention[]> {
    const map = new Map<string, Intervention[]>();
    for (const item of this.approved()) {
      const key = toDateKey(new Date(item.scheduledAt));
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return map;
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}
