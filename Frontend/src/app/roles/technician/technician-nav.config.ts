import { NavSection } from '../../core/types/nav';

// Flat, 4-item list, no nested children - this role has no admin/technical modules, only its
// own assigned work (see role brief: no inventory, no cabling, no VLANs, execution only).
// Profile and Notifications are deliberately not duplicated here - both are already reachable
// from the topbar (the avatar menu's "Profile" entry and the bell dropdown), so keeping them out
// of the sidebar too avoids two paths to the same screen. "My notes" is unrelated to that SSE
// notifications feed - standalone personal notes, not a duplicate of anything in the topbar.
export const TECHNICIAN_NAV: NavSection[] = [
  { labelKey: 'technician.nav.home', icon: 'home', path: 'home' },
  { labelKey: 'technician.nav.myInterventions', icon: 'checklist', path: 'my-interventions' },
  { labelKey: 'technician.nav.schedule', icon: 'calendar_month', path: 'schedule' },
  { labelKey: 'technician.nav.notes', icon: 'edit_note', path: 'notes' },
];
