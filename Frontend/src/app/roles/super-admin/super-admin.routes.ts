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
  'cabling/cables',
  'cabling/connectors',
  'cabling/path-tracing',
  'sdwan/edges',
  'sdwan/tunnels',
  'sdwan/circuits',
  'telemetry/connectors',
  'telemetry/dashboards',
  'telemetry/anomaly-detection',
  'interventions',
  'library/equipment-types',
  'library/technology-catalog',
  'administration/users',
  'administration/roles-permissions',
  'administration/settings',
  'integrations/connectors',
  'integrations/sync-drift',
  'audit-compliance',
  'reports',
  'ai/insights',
  'ai/settings',
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
      {
        path: 'cabling/cables',
        loadComponent: () =>
          import('./pages/cables/cables-list.component').then((m) => m.CablesListComponent),
        data: { titleKey: 'nav.cables', sectionKey: 'nav.cabling' },
      },
      {
        path: 'cabling/connectors',
        loadComponent: () =>
          import('./pages/connectors/connectors-list.component').then(
            (m) => m.ConnectorsListComponent,
          ),
        data: { titleKey: 'nav.connectorsTransceivers', sectionKey: 'nav.cabling' },
      },
      {
        path: 'cabling/path-tracing',
        loadComponent: () =>
          import('./pages/path-traces/path-traces-list.component').then(
            (m) => m.PathTracesListComponent,
          ),
        data: { titleKey: 'nav.pathTracing', sectionKey: 'nav.cabling' },
      },
      {
        path: 'sdwan/edges',
        loadComponent: () =>
          import('./pages/sdwan-edges/sdwan-edges-list.component').then(
            (m) => m.SdwanEdgesListComponent,
          ),
        data: { titleKey: 'nav.sdwanEdges', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/tunnels',
        loadComponent: () =>
          import('./pages/overlay-tunnels/overlay-tunnels-list.component').then(
            (m) => m.OverlayTunnelsListComponent,
          ),
        data: { titleKey: 'nav.overlayTunnels', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'sdwan/circuits',
        loadComponent: () =>
          import('./pages/carrier-circuits/carrier-circuits-list.component').then(
            (m) => m.CarrierCircuitsListComponent,
          ),
        data: { titleKey: 'nav.carrierCircuits', sectionKey: 'nav.sdwanConnectivity' },
      },
      {
        path: 'telemetry/connectors',
        loadComponent: () =>
          import('./pages/telemetry-connectors/telemetry-connectors-list.component').then(
            (m) => m.TelemetryConnectorsListComponent,
          ),
        data: { titleKey: 'nav.telemetryConnectors', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'telemetry/dashboards',
        loadComponent: () =>
          import('./pages/real-time-dashboards/real-time-dashboards-list.component').then(
            (m) => m.RealTimeDashboardsListComponent,
          ),
        data: { titleKey: 'nav.realTimeDashboards', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'telemetry/anomaly-detection',
        loadComponent: () =>
          import('./pages/anomaly-detections/anomaly-detections-list.component').then(
            (m) => m.AnomalyDetectionsListComponent,
          ),
        data: { titleKey: 'nav.anomalyDetection', sectionKey: 'nav.telemetryMonitoring' },
      },
      {
        path: 'interventions',
        loadComponent: () =>
          import('./pages/interventions/interventions-list.component').then(
            (m) => m.InterventionsListComponent,
          ),
        data: { titleKey: 'nav.interventions' },
      },
      {
        path: 'library/equipment-types',
        loadComponent: () =>
          import('./pages/equipment-types/equipment-types-list.component').then(
            (m) => m.EquipmentTypesListComponent,
          ),
        data: { titleKey: 'nav.equipmentTypes', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'library/technology-catalog',
        loadComponent: () =>
          import('./pages/technology-catalog/technology-catalog-list.component').then(
            (m) => m.TechnologyCatalogListComponent,
          ),
        data: { titleKey: 'nav.networkTechnologyCatalog', sectionKey: 'nav.technicalLibrary' },
      },
      {
        path: 'administration/users',
        loadComponent: () =>
          import('./pages/users/users-list.component').then((m) => m.UsersListComponent),
        data: { titleKey: 'nav.users', sectionKey: 'nav.administration' },
      },
      {
        path: 'administration/roles-permissions',
        loadComponent: () =>
          import('./pages/role-permissions/role-permissions-list.component').then(
            (m) => m.RolePermissionsListComponent,
          ),
        data: { titleKey: 'nav.rolesPermissions', sectionKey: 'nav.administration' },
      },
      {
        path: 'administration/settings',
        loadComponent: () =>
          import('./pages/system-settings/system-settings-list.component').then(
            (m) => m.SystemSettingsListComponent,
          ),
        data: { titleKey: 'nav.systemSettings', sectionKey: 'nav.administration' },
      },
      {
        path: 'integrations/connectors',
        loadComponent: () =>
          import('./pages/integration-connectors/integration-connectors-list.component').then(
            (m) => m.IntegrationConnectorsListComponent,
          ),
        data: { titleKey: 'nav.snmpNetconfGnmiConnectors', sectionKey: 'nav.integrations' },
      },
      {
        path: 'integrations/sync-drift',
        loadComponent: () =>
          import('./pages/sync-drifts/sync-drifts-list.component').then(
            (m) => m.SyncDriftsListComponent,
          ),
        data: { titleKey: 'nav.syncDrift', sectionKey: 'nav.integrations' },
      },
      {
        path: 'audit-compliance',
        loadComponent: () =>
          import('./pages/audit-logs/audit-logs-list.component').then(
            (m) => m.AuditLogsListComponent,
          ),
        data: { titleKey: 'nav.auditCompliance' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-list.component').then((m) => m.ReportsListComponent),
        data: { titleKey: 'nav.reports' },
      },
      {
        path: 'my-account',
        loadComponent: () =>
          import('./pages/my-account/my-account.component').then((m) => m.MyAccountComponent),
        data: { titleKey: 'nav.myAccount' },
      },
      {
        path: 'ai/insights',
        loadComponent: () =>
          import('./pages/ai-insights/ai-insights-list.component').then(
            (m) => m.AiInsightsListComponent,
          ),
        data: { titleKey: 'nav.aiInsights', sectionKey: 'nav.aiOperations' },
      },
      {
        path: 'ai/settings',
        loadComponent: () =>
          import('./pages/ai-settings/ai-settings.component').then((m) => m.AiSettingsComponent),
        data: { titleKey: 'nav.aiSettings', sectionKey: 'nav.aiOperations' },
      },
      ...placeholderRoutes,
    ],
  },
];
