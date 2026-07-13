import { NavSection } from '../../core/types/nav';

// Mirrors SUPER_ADMIN_NAV's structure and i18n keys (same screens, scoped data), minus the
// Super-Admin-only Administration group (users/roles/system-settings), plus a "My Datacenters"
// label and an Approval Queue leaf that are specific to this role's scope/approval model.
export const DC_ADMIN_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  {
    labelKey: 'nav.physicalInfrastructure',
    icon: 'domain',
    children: [
      { labelKey: 'nav.myDatacenters', icon: 'location_city', path: 'infrastructure/datacenters' },
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
      { labelKey: 'nav.overlayNetworksReadOnly', icon: 'layers', path: 'fabric/overlay-networks' },
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
  { labelKey: 'nav.carrierCircuits', icon: 'cell_tower', path: 'carrier-circuits' },
  {
    labelKey: 'nav.telemetryMonitoring',
    icon: 'sensors',
    children: [
      { labelKey: 'nav.telemetryConnectors', icon: 'sensors', path: 'telemetry/connectors' },
    ],
  },
  {
    labelKey: 'nav.interventions',
    icon: 'build',
    children: [
      { labelKey: 'nav.allInterventions', icon: 'list_alt', path: 'interventions' },
      {
        labelKey: 'nav.approvalQueue',
        icon: 'fact_check',
        path: 'interventions/approval-queue',
      },
    ],
  },
  {
    labelKey: 'nav.technicalLibrary',
    icon: 'menu_book',
    children: [
      { labelKey: 'nav.equipmentTypes', icon: 'category', path: 'library/equipment-types' },
    ],
  },
  { labelKey: 'nav.auditCompliance', icon: 'fact_check', path: 'audit-compliance' },
  { labelKey: 'nav.reports', icon: 'description', path: 'reports' },
];
