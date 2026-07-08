import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

// Placeholder for Step 3 - proves the record-level scoping boundary end-to-end (the backend
// 404s here, not just hides a button, if this intervention isn't assigned to the caller). The
// full checklist/rack-reference/photo-capture/completion flow is the Step 3 flagship build.
@Component({
  selector: 'app-technician-intervention-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './intervention-detail.component.html',
  styleUrl: './intervention-detail.component.css',
})
export class TechnicianInterventionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly interventionService = inject(TechnicianInterventionService);

  protected readonly loading = signal(true);
  protected readonly intervention = signal<Intervention | null>(null);
  protected readonly notFound = signal(false);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    try {
      const result = await this.interventionService.getById(id);
      this.intervention.set(result);
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
