import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard.component';
import { SUPER_ADMIN_NAV } from './super-admin-nav.config';
import { SuperAdminShellComponent } from './super-admin-shell.component';

// Leaves with a real page get their own explicit route below instead of an auto-generated
// placeholder — everything else in the nav still falls back to "Coming soon" until built.
const REAL_PAGE_PATHS = new Set([
  'infrastructure/datacenters',
  'infrastructure/rooms',
  'infrastructure/racks',
  'infrastructure/devices',
  'fabric/network-roles',
  'fabric/overlay-networks',
  'fabric/topology',
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

const placeholderRoutes: Routes = SUPER_ADMIN_NAV.flatMap(toPlaceholderRoutes);

export const superAdminRoutes: Routes = [
  {
    path: '',
    component: SuperAdminShellComponent,
    children: [
      { path: '', component: SuperAdminDashboardComponent, data: { titleKey: 'nav.dashboard' } },
      {
        path: 'infrastructure/datacenters',
        loadComponent: () =>
          import('./pages/datacenters/datacenters-list.component').then(
            (m) => m.DatacentersListComponent,
          ),
        data: { titleKey: 'nav.datacenters', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/rooms',
        loadComponent: () =>
          import('./pages/rooms/rooms-list.component').then((m) => m.RoomsListComponent),
        data: { titleKey: 'nav.rooms', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/racks',
        loadComponent: () =>
          import('./pages/racks/racks-list.component').then((m) => m.RacksListComponent),
        data: { titleKey: 'nav.racks', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/devices',
        loadComponent: () =>
          import('./pages/devices/devices-list.component').then((m) => m.DevicesListComponent),
        data: { titleKey: 'nav.devices', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'fabric/network-roles',
        loadComponent: () =>
          import('./pages/network-roles/network-roles-list.component').then(
            (m) => m.NetworkRolesListComponent,
          ),
        data: { titleKey: 'nav.networkRoles', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'fabric/overlay-networks',
        loadComponent: () =>
          import('./pages/overlay-networks/overlay-networks-list.component').then(
            (m) => m.OverlayNetworksListComponent,
          ),
        data: { titleKey: 'nav.vxlanEvpnOverlay', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'fabric/topology',
        loadComponent: () =>
          import('./pages/topology-links/topology-links-list.component').then(
            (m) => m.TopologyLinksListComponent,
          ),
        data: { titleKey: 'nav.interactiveTopologyView', sectionKey: 'nav.fabricTopology' },
      },
      ...placeholderRoutes,
    ],
  },
];
