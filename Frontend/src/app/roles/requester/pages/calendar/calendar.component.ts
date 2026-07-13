import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { RequesterDashboardService } from '../../../../core/services/requester-dashboard.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

interface CalendarDay {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  interventions: Intervention[];
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Hand-rolled month grid (no calendar library), mirrors ApproverCalendarComponent but fed by the
// same shared live stream the Dashboard/My Requests use (RequesterDashboardService.requests$),
// filtered client-side to APPROVED - no separate network call. Lets the requester see when their
// already-validated requests are actually scheduled.
@Component({
  selector: 'app-requester-calendar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequesterCalendarComponent {
  private readonly dashboardService = inject(RequesterDashboardService);

  private readonly page = toSignal(this.dashboardService.requests$, { initialValue: null });

  protected readonly loading = computed(() => this.page() === null);
  private readonly approved = computed<Intervention[]>(
    () => this.page()?.content.filter((r) => r.approvalStatus === 'APPROVED') ?? [],
  );

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
