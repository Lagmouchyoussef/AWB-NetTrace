import { InterventionType } from '../../roles/super-admin/pages/interventions/intervention.model';

// Only 5 palette tokens are genuinely distinct hues (see device-icons.ts) - DECOMMISSIONING
// shares the neutral "supporting" tone since it's the least frequent/urgent type in practice.
const TYPE_ICON: Record<InterventionType, string> = {
  INCIDENT_RESPONSE: 'emergency',
  CORRECTIVE_MAINTENANCE: 'build',
  PREVENTIVE_MAINTENANCE: 'event_repeat',
  INSPECTION: 'fact_check',
  INSTALLATION: 'add_box',
  DECOMMISSIONING: 'remove_circle',
};

const TYPE_COLOR: Record<InterventionType, string> = {
  INCIDENT_RESPONSE: 'var(--chart-critical)',
  CORRECTIVE_MAINTENANCE: 'var(--chart-serious)',
  PREVENTIVE_MAINTENANCE: 'var(--chart-good)',
  INSPECTION: 'var(--chart-warning)',
  INSTALLATION: 'var(--chart-series-1)',
  DECOMMISSIONING: 'var(--awb-on-surface-muted)',
};

export function interventionTypeIcon(type: InterventionType): string {
  return TYPE_ICON[type];
}

export function interventionTypeColor(type: InterventionType): string {
  return TYPE_COLOR[type];
}
