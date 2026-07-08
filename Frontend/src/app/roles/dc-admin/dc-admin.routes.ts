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
  'fabric/network-roles',
  'fabric/overlay-networks',
  'fabric/topology',
  'cabling/cables',
  'cabling/connectors',
  'cabling/path-tracing',
  'sdwan/edges',
  'sdwan/tunnels',
  'sdwan/circuits',
  'telemetry/connectors',
  'telemetry/dashboards',
  'interventions',
  'interventions/approval-queue',
  'anomaly-detections',
  'library/equipment-types',
  'library/technology-catalog',
  'audit-compliance',
  'reports',
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
        path: 'fabric/network-roles',
        loadComponent: () =>
          import('./pages/network-roles/network-roles-list.component').then(
            (m) => m.DcAdminNetworkRolesListComponent,
          ),
        data: { titleKey: 'nav.networkRoles', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'fabric/overlay-networks',
        loadComponent: () =>
          import('./pages/overlay-networks/overlay-networks-list.component').then(
            (m) => m.DcAdminOverlayNetworksListComponent,
          ),
        data: { titleKey: 'nav.vxlanEvpnOverlay', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'fabric/topology',
        loadComponent: () =>
          import('./pages/topology-links/topology-links-list.component').then(
            (m) => m.DcAdminTopologyLinksListComponent,
          ),
        data: { titleKey: 'nav.interactiveTopologyView', sectionKey: 'nav.fabricTopology' },
      },
      {
        path: 'cabling/cables',
        loadComponent: () =>
          import('./pages/cables/cables-list.component').then((m) => m.DcAdminCablesListComponent),
        data: { titleKey: 'nav.cables', sectionKey: 'nav.cabling' },
      },
      {
        path: 'cabling/connectors',
        loadComponent: () =>
          import('./pages/connectors/connectors-list.component').then(
            (m) => m.DcAdminConnectorsListComponent,
          ),
        data: { titleKey: 'nav.connectorsTransceivers', sectionKey: 'nav.cabling' },
      },
      {
        path: 'cabling/path-tracing',
        loadComponent: () =>
          import('./pages/path-traces/path-traces-list.component').then(
            (m) => m.DcAdminPathTracesListComponent,
          ),
        data: { titleKey: 'nav.pathTracing', sectionKey: 'nav.cabling' },
      },
      {
        path: 'sdwan/edges',
        loadComponent: () =>
          import('./pages/sdwan-edges/sdwan-edges-list.component').then(
            (m) => m.DcAdminSdwanEdgesListComponent,
          ),
        data: { titleKey: 'nav.sdwanEdges', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/tunnels',
        loadComponent: () =>
          import('./pages/overlay-tunnels/overlay-tunnels-list.component').then(
            (m) => m.DcAdminOverlayTunnelsListComponent,
          ),
        data: { titleKey: 'nav.overlayTunnels', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/circuits',
        loadComponent: () =>
          import('./pages/carrier-circuits/carrier-circuits-list.component').then(
            (m) => m.DcAdminCarrierCircuitsListComponent,
          ),
        data: { titleKey: 'nav.carrierCircuits', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'telemetry/connectors',
        loadComponent: () =>
          import('./pages/telemetry-connectors/telemetry-connectors-list.component').then(
            (m) => m.DcAdminTelemetryConnectorsListComponent,
          ),
        data: { titleKey: 'nav.telemetryConnectors', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'telemetry/dashboards',
        loadComponent: () =>
          import('./pages/real-time-dashboards/real-time-dashboards-list.component').then(
            (m) => m.DcAdminRealTimeDashboardsListComponent,
          ),
        data: { titleKey: 'nav.realTimeDashboards', sectionKey: 'nav.telemetryMonitoring' },
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
        path: 'interventions/approval-queue',
        loadComponent: () =>
          import('./pages/interventions/approval/approval-queue.component').then(
            (m) => m.DcAdminApprovalQueueComponent,
          ),
        data: { titleKey: 'nav.approvalQueue', sectionKey: 'nav.interventions' },
      },
      {
        path: 'anomaly-detections',
        loadComponent: () =>
          import('./pages/anomaly-detections/anomaly-detections-list.component').then(
            (m) => m.DcAdminAnomalyDetectionsListComponent,
          ),
        data: { titleKey: 'nav.anomalyDetection', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'library/equipment-types',
        loadComponent: () =>
          import('./pages/equipment-types/equipment-types-list.component').then(
            (m) => m.DcAdminEquipmentTypesListComponent,
          ),
        data: { titleKey: 'nav.equipmentTypes', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'library/technology-catalog',
        loadComponent: () =>
          import('./pages/technology-catalog/technology-catalog-list.component').then(
            (m) => m.DcAdminTechnologyCatalogListComponent,
          ),
        data: { titleKey: 'nav.networkTechnologyCatalog', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'audit-compliance',
        loadComponent: () =>
          import('./pages/audit-logs/audit-logs-list.component').then(
            (m) => m.DcAdminAuditLogsListComponent,
          ),
        data: { titleKey: 'nav.auditCompliance' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-list.component').then(
            (m) => m.DcAdminReportsListComponent,
          ),
        data: { titleKey: 'nav.reports' },
      },
      {
        path: 'my-account',
        loadComponent: () =>
          import('./pages/my-account/my-account.component').then(
            (m) => m.DcAdminMyAccountComponent,
          ),
        data: { titleKey: 'nav.myAccount' },
      },
      ...placeholderRoutes,
    ],
  },
];
