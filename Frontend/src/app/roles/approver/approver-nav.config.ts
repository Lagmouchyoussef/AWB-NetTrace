import { NavSection } from '../../core/types/nav';

// 7 items - this role's real scope: decide on pending requests (flagship), stay aware of the
// broader picture (all interventions, calendar), review its own past decisions (history, reports),
// and occasionally act as a requester itself (my requests). Reuses shared i18n keys wherever one
// already exists ('nav.dashboard'/'nav.approvalQueue'/'nav.allInterventions'/'nav.reports'/
// 'nav.myInterventionRequests', all already used by DC Admin/Network Engineer's own nav), only
// 'approver.nav.*' for the two screens genuinely specific to this role.
export const APPROVER_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  { labelKey: 'nav.approvalQueue', icon: 'fact_check', path: 'approval-queue' },
  { labelKey: 'nav.allInterventions', icon: 'list_alt', path: 'all-interventions' },
  { labelKey: 'approver.nav.calendar', icon: 'calendar_month', path: 'calendar' },
  { labelKey: 'approver.nav.decisionHistory', icon: 'history', path: 'decision-history' },
  { labelKey: 'nav.reports', icon: 'description', path: 'reports' },
  { labelKey: 'nav.myInterventionRequests', icon: 'build', path: 'my-requests' },
];
