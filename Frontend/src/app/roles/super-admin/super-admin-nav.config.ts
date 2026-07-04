import { NavSection } from '../../core/types/nav';

export const SUPER_ADMIN_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  {
    labelKey: 'nav.physicalInfrastructure',
    icon: 'domain',
    children: [
      { labelKey: 'nav.datacenters', icon: 'location_city', path: 'infrastructure/datacenters' },
      { labelKey: 'nav.rooms', icon: 'meeting_room', path: 'infrastructure/rooms' },
      { labelKey: 'nav.racks', icon: 'dns', path: 'infrastructure/racks' },
      { labelKey: 'nav.devices', icon: 'router', path: 'infrastructure/devices' },
    ],
  },
  {
    labelKey: 'nav.fabricTopology',
    icon: 'hub',
    children: [
      { labelKey: 'nav.networkRoles', icon: 'device_hub', path: 'fabric/network-roles' },
      { labelKey: 'nav.vxlanEvpnOverlay', icon: 'layers', path: 'fabric/overlay-networks' },
      { labelKey: 'nav.interactiveTopologyView', icon: 'share', path: 'fabric/topology' },
    ],
  },
  {
    labelKey: 'nav.cabling',
    icon: 'cable',
    children: [
      { labelKey: 'nav.cables', icon: 'cable', path: 'cabling/cables' },
      {
        labelKey: 'nav.connectorsTransceivers',
        icon: 'settings_input_hdmi',
        path: 'cabling/connectors',
      },
      { labelKey: 'nav.pathTracing', icon: 'route', path: 'cabling/path-tracing' },
    ],
  },
  {
    labelKey: 'nav.sdwanConnectivity',
    icon: 'cloud',
    children: [
      { labelKey: 'nav.sdwanEdges', icon: 'router', path: 'sdwan/edges' },
      { labelKey: 'nav.overlayTunnels', icon: 'swap_horiz', path: 'sdwan/tunnels' },
      { labelKey: 'nav.carrierCircuits', icon: 'cell_tower', path: 'sdwan/circuits' },
    ],
  },
  {
    labelKey: 'nav.telemetryMonitoring',
    icon: 'sensors',
    children: [
      { labelKey: 'nav.telemetryConnectors', icon: 'sensors', path: 'telemetry/connectors' },
      { labelKey: 'nav.realTimeDashboards', icon: 'monitoring', path: 'telemetry/dashboards' },
      {
        labelKey: 'nav.anomalyDetection',
        icon: 'troubleshoot',
        path: 'telemetry/anomaly-detection',
      },
    ],
  },
  { labelKey: 'nav.interventions', icon: 'build', path: 'interventions' },
  {
    labelKey: 'nav.technicalLibrary',
    icon: 'menu_book',
    children: [
      { labelKey: 'nav.equipmentTypes', icon: 'category', path: 'library/equipment-types' },
      {
        labelKey: 'nav.networkTechnologyCatalog',
        icon: 'list_alt',
        path: 'library/technology-catalog',
      },
    ],
  },
  {
    labelKey: 'nav.administration',
    icon: 'admin_panel_settings',
    children: [
      { labelKey: 'nav.users', icon: 'group', path: 'administration/users' },
      {
        labelKey: 'nav.rolesPermissions',
        icon: 'security',
        path: 'administration/roles-permissions',
      },
      { labelKey: 'nav.systemSettings', icon: 'tune', path: 'administration/settings' },
    ],
  },
  {
    labelKey: 'nav.integrations',
    icon: 'integration_instructions',
    children: [
      {
        labelKey: 'nav.snmpNetconfGnmiConnectors',
        icon: 'extension',
        path: 'integrations/connectors',
      },
      { labelKey: 'nav.syncDrift', icon: 'sync', path: 'integrations/sync-drift' },
    ],
  },
  { labelKey: 'nav.auditCompliance', icon: 'fact_check', path: 'audit-compliance' },
  { labelKey: 'nav.reports', icon: 'description', path: 'reports' },
];
