import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { NETWORK_ENGINEER_NAV } from './network-engineer-nav.config';
import { NetworkEngineerShellComponent } from './network-engineer-shell.component';

// Leaves with a real page get their own explicit route below instead of an auto-generated
// placeholder - everything else in the nav still falls back to "Coming soon" until built
// (mirrors dc-admin.routes.ts's REAL_PAGE_PATHS pattern).
const REAL_PAGE_PATHS = new Set([
  'infrastructure/datacenters',
  'infrastructure/rooms',
  'infrastructure/racks',
  'infrastructure/devices',
  'fabric/network-roles',
  'fabric/overlay-networks',
  'cabling/cables',
  'cabling/connectors',
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

const placeholderRoutes: Routes = NETWORK_ENGINEER_NAV.flatMap(toPlaceholderRoutes);

export const networkEngineerRoutes: Routes = [
  {
    path: '',
    component: NetworkEngineerShellComponent,
    children: [
      {
        path: '',
        component: PlaceholderPageComponent,
        data: { titleKey: 'nav.dashboard' },
      },
      {
        path: 'infrastructure/datacenters',
        loadComponent: () =>
          import('./pages/infrastructure/datacenters/datacenters-list.component').then(
            (m) => m.NeDatacentersListComponent,
          ),
        data: { titleKey: 'nav.datacenters', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/rooms',
        loadComponent: () =>
          import('./pages/infrastructure/rooms/rooms-list.component').then(
            (m) => m.NeRoomsListComponent,
          ),
        data: { titleKey: 'nav.rooms', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/racks',
        loadComponent: () =>
          import('./pages/infrastructure/racks/racks-list.component').then(
            (m) => m.NeRacksListComponent,
          ),
        data: { titleKey: 'nav.racks', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'infrastructure/devices',
        loadComponent: () =>
          import('./pages/infrastructure/devices/devices-list.component').then(
            (m) => m.NeDevicesListComponent,
          ),
        data: { titleKey: 'nav.devices', sectionKey: 'nav.physicalInfrastructure' },
      },
      {
        path: 'fabric/network-roles',
        loadComponent: () =>
          import('./pages/fabric/network-roles/network-roles-list.component').then(
            (m) => m.NeNetworkRolesListComponent,
          ),
        data: { titleKey: 'nav.networkRoles', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'fabric/overlay-networks',
        loadComponent: () =>
          import('./pages/fabric/overlay-networks/overlay-networks-list.component').then(
            (m) => m.NeOverlayNetworksListComponent,
          ),
        data: { titleKey: 'nav.vxlanEvpnOverlay', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'cabling/cables',
        loadComponent: () =>
          import('./pages/cabling/cable-list/cables-list.component').then(
            (m) => m.NeCablesListComponent,
          ),
        data: { titleKey: 'nav.cables', sectionKey: 'nav.cabling' },
      },
      {
        path: 'cabling/connectors',
        loadComponent: () =>
          import('./pages/cabling/connectors/connectors-list.component').then(
            (m) => m.NeConnectorsListComponent,
          ),
        data: { titleKey: 'nav.connectorsTransceivers', sectionKey: 'nav.cabling' },
      },
      ...placeholderRoutes,
    ],
  },
];
