import { NavSection } from '../../core/types/nav';

// Flat, 5-item list, no nested children - this role has no admin/technical modules, only its
// own assigned work (see role brief: no inventory, no cabling, no VLANs, execution only).
export const TECHNICIAN_NAV: NavSection[] = [
  { labelKey: 'technician.nav.home', icon: 'home', path: 'home' },
  { labelKey: 'technician.nav.myInterventions', icon: 'checklist', path: 'my-interventions' },
  { labelKey: 'technician.nav.schedule', icon: 'calendar_month', path: 'schedule' },
  { labelKey: 'technician.nav.notifications', icon: 'notifications', path: 'notifications' },
  { labelKey: 'technician.nav.profile', icon: 'person', path: 'profile' },
];
