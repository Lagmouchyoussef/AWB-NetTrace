import { NavSection } from '../../core/types/nav';

// This role only submits and tracks its own requests plus a read-only device reference - no
// infrastructure management and no approval capability. My Account is reachable only via the
// topbar profile menu, same convention as Network Engineer/Approver/Auditor's own nav configs.
export const REQUESTER_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  { labelKey: 'nav.myInterventionRequests', icon: 'build', path: 'my-requests' },
  { labelKey: 'requester.nav.calendar', icon: 'calendar_month', path: 'calendar' },
  { labelKey: 'nav.devices', icon: 'router', path: 'devices' },
  { labelKey: 'nav.reports', icon: 'summarize', path: 'reports' },
];
