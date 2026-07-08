import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { NETWORK_ENGINEER_NAV } from './network-engineer-nav.config';
import { NetworkEngineerShellComponent } from './network-engineer-shell.component';
import { NetworkEngineerDashboardComponent } from './pages/dashboard/network-engineer-dashboard.component';

// Leaves with a real page get their own explicit route below instead of an auto-generated
// placeholder - everything else in the nav still falls back to "Coming soon" until built
// (mirrors dc-admin.routes.ts's REAL_PAGE_PATHS pattern).
const REAL_PAGE_PATHS = new Set([
  'topology-view',
  'path-tracing',
  'infrastructure/datacenters',
  'infrastructure/rooms',
  'infrastructure/racks',
  'infrastructure/devices',
  'fabric/network-roles',
  'fabric/overlay-networks',
  'cabling/cables',
  'cabling/connectors',
  'sdwan/edges',
  'sdwan/tunnels',
  'sdwan/circuits',
  'telemetry/connectors',
  'telemetry/dashboards',
  'library/equipment-types',
  'library/technology-catalog',
  'my-requests',
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
        component: NetworkEngineerDashboardComponent,
        data: { titleKey: 'nav.dashboard' },
      },
      {
        path: 'topology-view',
        loadComponent: () =>
          import('./pages/fabric/topology-view/topology-view.component').then(
            (m) => m.NeTopologyViewComponent,
          ),
        data: { titleKey: 'nav.interactiveTopologyView' },
      },
      {
        path: 'path-tracing',
        loadComponent: () =>
          import('./pages/cabling/path-tracing/path-tracing.component').then(
            (m) => m.NePathTracingComponent,
          ),
        data: { titleKey: 'nav.pathTracing' },
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
      {
        path: 'sdwan/edges',
        loadComponent: () =>
          import('./pages/sdwan/edges/sdwan-edges-list.component').then(
            (m) => m.NeSdwanEdgesListComponent,
          ),
        data: { titleKey: 'nav.sdwanEdges', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/tunnels',
        loadComponent: () =>
          import('./pages/sdwan/tunnels/overlay-tunnels-list.component').then(
            (m) => m.NeOverlayTunnelsListComponent,
          ),
        data: { titleKey: 'nav.overlayTunnels', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/circuits',
        loadComponent: () =>
          import('./pages/sdwan/circuits/carrier-circuits-list.component').then(
            (m) => m.NeCarrierCircuitsListComponent,
          ),
        data: { titleKey: 'nav.carrierCircuits', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'telemetry/connectors',
        loadComponent: () =>
          import('./pages/telemetry/connectors/telemetry-connectors-list.component').then(
            (m) => m.NeTelemetryConnectorsListComponent,
          ),
        data: { titleKey: 'nav.telemetryConnectors', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'telemetry/dashboards',
        loadComponent: () =>
          import('./pages/telemetry/dashboards/real-time-dashboards-list.component').then(
            (m) => m.NeRealTimeDashboardsListComponent,
          ),
        data: { titleKey: 'nav.realTimeDashboards', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'library/equipment-types',
        loadComponent: () =>
          import('./pages/library/device-types/equipment-types-list.component').then(
            (m) => m.NeEquipmentTypesListComponent,
          ),
        data: { titleKey: 'nav.equipmentTypes', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'library/technology-catalog',
        loadComponent: () =>
          import('./pages/library/technology-catalog/technology-catalog-list.component').then(
            (m) => m.NeTechnologyCatalogListComponent,
          ),
        data: { titleKey: 'nav.networkTechnologyCatalog', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./pages/my-requests/my-requests-list.component').then(
            (m) => m.NeMyRequestsListComponent,
          ),
        data: { titleKey: 'nav.myInterventionRequests' },
      },
      ...placeholderRoutes,
    ],
  },
];
