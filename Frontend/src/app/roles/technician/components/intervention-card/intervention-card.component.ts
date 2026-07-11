import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  interventionTypeColor,
  interventionTypeIcon,
} from '../../../../core/utils/intervention-type-icons';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

// Shared by Home (today's actionable work) and My Interventions (full personal history) - kept
// as one component so the two screens never visually drift apart.
@Component({
  selector: 'app-intervention-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './intervention-card.component.html',
  styleUrl: './intervention-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionCardComponent {
  readonly intervention = input.required<Intervention>();

  protected typeIcon(type: Intervention['interventionType']): string {
    return interventionTypeIcon(type);
  }

  protected typeColor(type: Intervention['interventionType']): string {
    return interventionTypeColor(type);
  }

  protected actionLabelKey(status: Intervention['status']): string {
    if (status === 'IN_PROGRESS') {
      return 'technician.home.continue';
    }
    if (status === 'SCHEDULED') {
      return 'technician.home.start';
    }
    return 'technician.myInterventions.view';
  }
}
