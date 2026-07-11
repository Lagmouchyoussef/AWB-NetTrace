import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import {
  Intervention,
  InterventionPriority,
} from '../../../super-admin/pages/interventions/intervention.model';
import { InterventionCardComponent } from '../../components/intervention-card/intervention-card.component';

const URGENT_PRIORITIES = new Set<InterventionPriority>(['CRITICAL', 'HIGH']);

const PRIORITY_RANK: Record<InterventionPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

// Home shows actionable work (scheduled/in progress/on hold), not the full history - completed
// and cancelled interventions live in the "My Interventions" list instead. Demo seed timestamps
// are relative offsets from first boot, not literal "today", so filtering on status rather than
// calendar date keeps this screen meaningful regardless of when the app was last seeded.
const ACTIONABLE_STATUSES = new Set(['SCHEDULED', 'IN_PROGRESS', 'ON_HOLD']);

@Component({
  selector: 'app-technician-home',
  standalone: true,
  imports: [TranslatePipe, InterventionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianHomeComponent implements OnInit {
  private readonly interventionService = inject(TechnicianInterventionService);
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly interventions = signal<Intervention[]>([]);

  protected readonly username = computed(() => this.authService.username() ?? '');
  protected readonly totalCount = computed(() => this.interventions().length);
  protected readonly urgentCount = computed(
    () => this.interventions().filter((i) => URGENT_PRIORITIES.has(i.priority)).length,
  );
  protected readonly inProgressCount = computed(
    () => this.interventions().filter((i) => i.status === 'IN_PROGRESS').length,
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({ page: 0, size: 100 });
      const actionable = result.content
        .filter((i) => ACTIONABLE_STATUSES.has(i.status))
        .sort((a, b) => {
          const priorityDelta = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
          if (priorityDelta !== 0) {
            return priorityDelta;
          }
          return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        });
      this.interventions.set(actionable);
    } finally {
      this.loading.set(false);
    }
  }
}
