import { NavSection } from '../../core/types/nav';

// Independent oversight only - no section here has any create/edit affordance anywhere (see
// AuditorAuditLogController etc.: GET-only backend, not just a hidden button). The "System
// Oversight" group is deliberately not labelled "Administration" (unlike Super Admin's own nav)
// so it never implies write access this role doesn't have.
export const AUDITOR_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  { labelKey: 'nav.auditCompliance', icon: 'fact_check', path: 'audit-log' },
  { labelKey: 'nav.allInterventions', icon: 'build_circle', path: 'interventions' },
  {
    labelKey: 'nav.systemOversight',
    icon: 'shield',
    children: [
      { labelKey: 'nav.users', icon: 'group', path: 'users' },
      { labelKey: 'nav.rolesPermissions', icon: 'security', path: 'role-permissions' },
      { labelKey: 'nav.systemSettings', icon: 'tune', path: 'system-settings' },
    ],
  },
  { labelKey: 'nav.reports', icon: 'summarize', path: 'reports' },
];
