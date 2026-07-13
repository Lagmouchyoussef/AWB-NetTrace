import { NavSection } from '../../core/types/nav';

// Topology View and Path-Tracing are this role's daily tools, so they're deliberately flat
// top-level items (not nested under Fabric/Cabling) for one-click access, per the role brief.
// No Audit Log, no Administration, no delete-capable screens anywhere - this role creates and
// modifies, it doesn't govern or destroy.
export const NETWORK_ENGINEER_NAV: NavSection[] = [
  { labelKey: 'nav.dashboard', icon: 'dashboard', path: '' },
  { labelKey: 'nav.interactiveTopologyView', icon: 'share', path: 'topology-view' },
  { labelKey: 'nav.pathTracing', icon: 'route', path: 'path-tracing' },
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
      { labelKey: 'nav.overlayNetworksReadOnly', icon: 'layers', path: 'fabric/overlay-networks' },
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
  { labelKey: 'nav.myInterventionRequests', icon: 'build', path: 'my-requests' },
  {
    labelKey: 'nav.technicalLibrary',
    icon: 'menu_book',
    children: [
      { labelKey: 'nav.equipmentTypes', icon: 'category', path: 'library/equipment-types' },
    ],
  },
];
