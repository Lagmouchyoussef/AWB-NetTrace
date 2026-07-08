import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

// Placeholder for Step 2 - proves the scoped list call end-to-end (real data, no mocks) while
// the full card-list UI is built next. Full design lands in Step 2.
@Component({
  selector: 'app-technician-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class TechnicianHomeComponent implements OnInit {
  private readonly interventionService = inject(TechnicianInterventionService);

  protected readonly loading = signal(true);
  protected readonly interventions = signal<Intervention[]>([]);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.interventionService.list({ page: 0, size: 50 });
      this.interventions.set(result.content);
    } finally {
      this.loading.set(false);
    }
  }
}
