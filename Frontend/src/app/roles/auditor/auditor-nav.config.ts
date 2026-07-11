import { NavSection } from '../../core/types/nav';

// Flat, 4-item list - independent oversight only, no nested admin/technical modules and no
// section here has any create/edit affordance anywhere (see AuditorAuditLogController etc.:
// GET-only backend, not just a hidden button).
export const AUDITOR_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  { labelKey: 'nav.auditCompliance', icon: 'fact_check', path: 'audit-log' },
  { labelKey: 'nav.anomalyDetection', icon: 'sensors', path: 'anomaly-detections' },
  { labelKey: 'nav.reports', icon: 'summarize', path: 'reports' },
];
