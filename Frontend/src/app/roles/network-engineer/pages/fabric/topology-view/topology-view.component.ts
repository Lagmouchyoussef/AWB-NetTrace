import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import cytoscape, { Core, ElementDefinition, EventObject, NodeSingular } from 'cytoscape';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NetworkEngineerDatacenterService } from '../../../../../core/services/network-engineer-datacenter.service';
import { NetworkEngineerRoomService } from '../../../../../core/services/network-engineer-room.service';
import { NetworkEngineerRackService } from '../../../../../core/services/network-engineer-rack.service';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { NetworkEngineerNetworkRoleService } from '../../../../../core/services/network-engineer-network-role.service';
import { NetworkEngineerCableService } from '../../../../../core/services/network-engineer-cable.service';
import { Device } from '../../../../super-admin/pages/devices/device.model';
import { NetworkRoleType } from '../../../../super-admin/pages/network-roles/network-role.model';
import { Cable } from '../../../../super-admin/pages/cables/cable.model';
import { resolveCssColor } from '../../../../../core/utils/css-color.util';

interface DatacenterOption {
  id: number;
  name: string;
}

interface DeviceNodeData {
  id: string;
  label: string;
  roleType: NetworkRoleType | 'UNASSIGNED';
  datacenterId: number | null;
}

// --chart-ordinal-1..5 is a single-hue severity ramp, not a categorical palette - reusing it
// here made LEAF/TOR_SWITCH read as near-identical dusty reds. Only 5 tokens in the palette are
// genuinely distinct hues; TOR_SWITCH falls back to the neutral tone since its hexagon SHAPE
// (see ROLE_SHAPE below) already makes it visually distinct without needing a 6th color.
const ROLE_COLOR_VAR: Record<string, string> = {
  SUPER_SPINE: 'var(--chart-series-1)',
  SPINE: 'var(--chart-good)',
  LEAF: 'var(--chart-warning)',
  BORDER_LEAF: 'var(--chart-serious)',
  TOR_SWITCH: 'var(--awb-on-surface-muted)',
  ROUTE_REFLECTOR: 'var(--chart-critical)',
  UNASSIGNED: 'var(--awb-on-surface-muted)',
};

const ROLE_SHAPE: Record<string, string> = {
  SUPER_SPINE: 'round-rectangle',
  SPINE: 'rectangle',
  LEAF: 'ellipse',
  BORDER_LEAF: 'diamond',
  TOR_SWITCH: 'hexagon',
  ROUTE_REFLECTOR: 'star',
  UNASSIGNED: 'ellipse',
};

// Topology View has no dedicated backend endpoint - it's Devices (nodes, colored/shaped by their
// NetworkRole.roleType if one exists) plus Cables (edges) rendered live via Cytoscape, joined
// client-side. Datacenter filtering needs a Device -> Rack -> Room -> Datacenter walk since
// Device only carries a rack reference.
@Component({
  selector: 'app-ne-topology-view',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './topology-view.component.html',
  styleUrl: './topology-view.component.css',
})
export class NeTopologyViewComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer', { static: true })
  private graphContainer!: ElementRef<HTMLDivElement>;

  private readonly datacenterService = inject(NetworkEngineerDatacenterService);
  private readonly roomService = inject(NetworkEngineerRoomService);
  private readonly rackService = inject(NetworkEngineerRackService);
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly networkRoleService = inject(NetworkEngineerNetworkRoleService);
  private readonly cableService = inject(NetworkEngineerCableService);
  private readonly translateService = inject(TranslateService);

  protected readonly loading = signal(true);
  protected readonly datacenters = signal<DatacenterOption[]>([]);
  protected readonly roleTypes: (NetworkRoleType | 'UNASSIGNED')[] = [
    'SUPER_SPINE',
    'SPINE',
    'LEAF',
    'BORDER_LEAF',
    'TOR_SWITCH',
    'ROUTE_REFLECTOR',
    'UNASSIGNED',
  ];

  protected readonly selectedDatacenterId = signal<number | 'ALL'>('ALL');
  protected readonly selectedRoleType = signal<NetworkRoleType | 'UNASSIGNED' | 'ALL'>('ALL');

  protected readonly selectedDevice = signal<Device | null>(null);
  protected readonly selectedDeviceRole = signal<NetworkRoleType | null>(null);
  protected readonly selectedDeviceCables = signal<Cable[]>([]);

  private cy: Core | null = null;
  private allDevices: Device[] = [];
  private allCables: Cable[] = [];
  private deviceDatacenterMap = new Map<number, number | null>();
  private deviceRoleMap = new Map<number, NetworkRoleType>();

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [datacenters, rooms, racks, devices, roles, cables] = await Promise.all([
        this.datacenterService.list({ page: 0, size: 1000 }),
        this.roomService.list({ page: 0, size: 1000 }),
        this.rackService.list({ page: 0, size: 1000 }),
        this.deviceService.list({ page: 0, size: 1000 }),
        this.networkRoleService.list({ page: 0, size: 1000 }),
        this.cableService.list({ page: 0, size: 1000 }),
      ]);

      this.datacenters.set(datacenters.content.map((d) => ({ id: d.id, name: d.name })));

      const roomDatacenterMap = new Map(rooms.content.map((r) => [r.id, r.datacenterId]));
      const rackRoomMap = new Map(racks.content.map((r) => [r.id, r.roomId]));

      this.deviceDatacenterMap = new Map(
        devices.content.map((d) => {
          const roomId = rackRoomMap.get(d.rackId);
          const datacenterId =
            roomId !== undefined ? (roomDatacenterMap.get(roomId) ?? null) : null;
          return [d.id, datacenterId];
        }),
      );
      this.deviceRoleMap = new Map(roles.content.map((r) => [r.deviceId, r.roleType]));

      this.allDevices = devices.content;
      this.allCables = cables.content;

      this.renderGraph();
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.cy?.destroy();
  }

  protected onDatacenterFilterChange(value: string): void {
    this.selectedDatacenterId.set(value === 'ALL' ? 'ALL' : Number(value));
    this.renderGraph();
  }

  protected onRoleFilterChange(value: string): void {
    this.selectedRoleType.set(value as NetworkRoleType | 'UNASSIGNED' | 'ALL');
    this.renderGraph();
  }

  protected closeDetailPanel(): void {
    this.selectedDevice.set(null);
  }

  private renderGraph(): void {
    const datacenterFilter = this.selectedDatacenterId();
    const roleFilter = this.selectedRoleType();

    const visibleDevices = this.allDevices.filter((device) => {
      const dcId = this.deviceDatacenterMap.get(device.id) ?? null;
      const role = this.deviceRoleMap.get(device.id) ?? 'UNASSIGNED';
      const matchesDc = datacenterFilter === 'ALL' || dcId === datacenterFilter;
      const matchesRole = roleFilter === 'ALL' || role === roleFilter;
      return matchesDc && matchesRole;
    });
    const visibleIds = new Set(visibleDevices.map((d) => d.id));

    const nodeElements: ElementDefinition[] = visibleDevices.map((device) => {
      const role = this.deviceRoleMap.get(device.id) ?? 'UNASSIGNED';
      const data: DeviceNodeData = {
        id: `d${device.id}`,
        label: device.name,
        roleType: role,
        datacenterId: this.deviceDatacenterMap.get(device.id) ?? null,
      };
      return { group: 'nodes', data };
    });

    const edgeElements: ElementDefinition[] = this.allCables
      .filter(
        (cable) => visibleIds.has(cable.sourceDeviceId) && visibleIds.has(cable.targetDeviceId),
      )
      .map((cable) => ({
        group: 'edges',
        data: {
          id: `c${cable.id}`,
          source: `d${cable.sourceDeviceId}`,
          target: `d${cable.targetDeviceId}`,
          pairKey: [cable.sourceDeviceId, cable.targetDeviceId].sort((a, b) => a - b).join('-'),
          status: cable.status,
        },
      }));

    if (this.cy) {
      this.cy.destroy();
    }

    this.cy = cytoscape({
      container: this.graphContainer.nativeElement,
      elements: [...nodeElements, ...edgeElements],
      userZoomingEnabled: true,
      userPanningEnabled: true,
      wheelSensitivity: 0.2,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (el: NodeSingular) =>
              resolveCssColor(ROLE_COLOR_VAR[(el.data('roleType') as string) ?? 'UNASSIGNED']),
            shape: (el: NodeSingular) =>
              (ROLE_SHAPE[(el.data('roleType') as string) ?? 'UNASSIGNED'] ??
                'ellipse') as cytoscape.Css.NodeShape,
            label: 'data(label)',
            color: resolveCssColor('var(--awb-on-surface)'),
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            width: 34,
            height: 34,
            'border-width': 2,
            'border-color': resolveCssColor('var(--awb-surface)'),
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': resolveCssColor('var(--chart-series-1)'),
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': resolveCssColor('var(--awb-border)'),
            'curve-style': 'bezier',
            'target-arrow-shape': 'none',
          },
        },
        {
          selector: 'edge[status = "FAULTY"]',
          style: { 'line-color': resolveCssColor('var(--chart-critical)') },
        },
        {
          selector: 'edge[status = "DISCONNECTED"]',
          style: {
            'line-color': resolveCssColor('var(--awb-on-surface-muted)'),
            'line-style': 'dashed',
          },
        },
        {
          selector: 'edge.redundant-highlight',
          style: {
            'line-color': resolveCssColor('var(--chart-series-1)'),
            width: 3.5,
          },
        },
      ],
      layout: { name: 'cose', animate: false, padding: 40 },
    });

    this.cy.on('tap', 'node', (event: EventObject) => {
      const deviceId = Number(event.target.id().slice(1));
      this.openDeviceDetail(deviceId);
    });

    this.cy.on('mouseover', 'edge', (event: EventObject) => {
      const pairKey = event.target.data('pairKey') as string;
      this.cy
        ?.edges()
        .filter((edge: cytoscape.EdgeSingular) => edge.data('pairKey') === pairKey)
        .addClass('redundant-highlight');
    });

    this.cy.on('mouseout', 'edge', () => {
      this.cy?.edges().removeClass('redundant-highlight');
    });
  }

  private openDeviceDetail(deviceId: number): void {
    const device = this.allDevices.find((d) => d.id === deviceId) ?? null;
    this.selectedDevice.set(device);
    this.selectedDeviceRole.set(this.deviceRoleMap.get(deviceId) ?? null);
    this.selectedDeviceCables.set(
      this.allCables.filter(
        (cable) => cable.sourceDeviceId === deviceId || cable.targetDeviceId === deviceId,
      ),
    );
  }

  protected roleLabel(roleType: string): string {
    return this.translateService.instant(`networkRoles.roleType.${roleType}`);
  }
}
