import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { DcAdminDashboardComponent } from './pages/dc-admin-dashboard.component';
import { DC_ADMIN_NAV } from './dc-admin-nav.config';
import { DcAdminShellComponent } from './dc-admin-shell.component';

// Leaves with a real page get their own explicit route below instead of an auto-generated
// placeholder - everything else in the nav still falls back to "Coming soon" until built
// (mirrors super-admin.routes.ts's REAL_PAGE_PATHS pattern).
const REAL_PAGE_PATHS = new Set([
  'infrastructure/datacenters',
  'infrastructure/rooms',
  'infrastructure/racks',
  'infrastructure/devices',
  'interventions',
  'anomaly-detections',
]);

function toPlaceholderRoutes(section: NavSection): Routes {
  const leaves = section.children ?? (section.path === undefined ? [] : [section]);
  return leaves
    .filter((leaf) => leaf.path !== '' && !REAL_PAGE_PATHS.has(leaf.path ?? ''))
    .map((leaf) => ({
      path: leaf.path,
      component: PlaceholderPageComponent,
      data: {
        titleKey: leaf.labelKey,
        sectionKey: section.children ? section.labelKey : undefined,
      },
    }));
}

const placeholderRoutes: Routes = DC_ADMIN_NAV.flatMap(toPlaceholderRoutes);

export const dcAdminRoutes: Routes = [
  {
    path: '',
    component: DcAdminShellComponent,
    children: [
      { path: '', component: DcAdminDashboardComponent, data: { titleKey: 'nav.dashboard' } },
      {
        path: 'infrastructure/datacenters',
        loadComponent: () =>
          import('./pages/datacenters/datacenters-list.component').then(
            (m) => m.DcAdminDatacentersListComponent,
          ),
        data: { titleKey: 'nav.myDatacenters', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/rooms',
        loadComponent: () =>
          import('./pages/rooms/rooms-list.component').then((m) => m.DcAdminRoomsListComponent),
        data: { titleKey: 'nav.rooms', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/racks',
        loadComponent: () =>
          import('./pages/racks/racks-list.component').then((m) => m.DcAdminRacksListComponent),
        data: { titleKey: 'nav.racks', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/devices',
        loadComponent: () =>
          import('./pages/devices/devices-list.component').then(
            (m) => m.DcAdminDevicesListComponent,
          ),
        data: { titleKey: 'nav.devices', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'interventions',
        loadComponent: () =>
          import('./pages/interventions/interventions-list.component').then(
            (m) => m.DcAdminInterventionsListComponent,
          ),
        data: { titleKey: 'nav.allInterventions', sectionKey: 'nav.interventions' },
      },
      {
        path: 'anomaly-detections',
        loadComponent: () =>
          import('./pages/anomaly-detections/anomaly-detections-list.component').then(
            (m) => m.DcAdminAnomalyDetectionsListComponent,
          ),
        data: { titleKey: 'nav.anomalyDetection', sectionKey: 'nav.telemetryMonitoring' },
      },
      ...placeholderRoutes,
    ],
  },
];
