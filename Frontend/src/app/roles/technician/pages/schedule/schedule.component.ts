import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

interface ScheduleDay {
  date: Date;
  dateKey: string;
  isToday: boolean;
  interventions: Intervention[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  // getDay(): 0=Sunday..6=Saturday - shift so the week starts on Monday.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Week view of upcoming (and recent) assigned work. Demo seed timestamps are relative offsets
// from first boot rather than literal calendar dates, so this fetches a wide window (all
// assigned interventions, client-grouped by day) rather than asking the backend for "this
// week" specifically - there is no dedicated calendar endpoint, this role has no create/edit
// rights over scheduling anyway (assignment is done by DC Admin/Super Admin).
@Component({
  selector: 'app-technician-schedule',
  standalone: true,
  imports: [TranslatePipe, DatePipe],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class TechnicianScheduleComponent implements OnInit {
  private readonly interventionService = inject(TechnicianInterventionService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly loading = signal(true);
  private readonly allInterventions = signal<Intervention[]>([]);
  protected readonly weekStart = signal<Date>(startOfWeek(new Date()));

  protected readonly weekLabel = computed(() => {
    const start = this.weekStart();
    const end = new Date(start.getTime() + 6 * DAY_MS);
    const fmt = (d: Date): string =>
      d.toLocaleDateString(this.translate.currentLang() || 'en', {
        day: 'numeric',
        month: 'short',
      });
    return `${fmt(start)} – ${fmt(end)}`;
  });

  protected readonly days = computed<ScheduleDay[]>(() => {
    const start = this.weekStart();
    const byDay = new Map<string, Intervention[]>();
    for (const intervention of this.allInterventions()) {
      const key = toDateKey(new Date(intervention.scheduledAt));
      const bucket = byDay.get(key) ?? [];
      bucket.push(intervention);
      byDay.set(key, bucket);
    }
    const todayKey = toDateKey(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start.getTime() + i * DAY_MS);
      const dateKey = toDateKey(date);
      const dayInterventions = (byDay.get(dateKey) ?? []).sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
      return { date, dateKey, isToday: dateKey === todayKey, interventions: dayInterventions };
    });
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({ page: 0, size: 500 });
      this.allInterventions.set(result.content);
    } finally {
      this.loading.set(false);
    }
  }

  protected onPreviousWeek(): void {
    this.weekStart.set(new Date(this.weekStart().getTime() - 7 * DAY_MS));
  }

  protected onNextWeek(): void {
    this.weekStart.set(new Date(this.weekStart().getTime() + 7 * DAY_MS));
  }

  protected onToday(): void {
    this.weekStart.set(startOfWeek(new Date()));
  }

  protected onOpen(intervention: Intervention): void {
    this.router.navigate(['/technician/interventions', intervention.id]);
  }

  protected timeOf(intervention: Intervention): string {
    return new Date(intervention.scheduledAt).toLocaleTimeString(
      this.translate.currentLang() || 'en',
      { hour: '2-digit', minute: '2-digit' },
    );
  }
}
