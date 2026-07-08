import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import cytoscape, { Core, ElementDefinition, NodeSingular } from 'cytoscape';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkEngineerDeviceService } from '../../../../../core/services/network-engineer-device.service';
import { NetworkEngineerCableService } from '../../../../../core/services/network-engineer-cable.service';
import { NetworkEngineerConnectorService } from '../../../../../core/services/network-engineer-connector.service';
import { deviceBadgeColor, deviceIconDataUri } from '../../../../../core/utils/device-icons';
import { resolveCssColor } from '../../../../../core/utils/css-color.util';
import { Device } from '../../../../super-admin/pages/devices/device.model';
import { Cable } from '../../../../super-admin/pages/cables/cable.model';
import { Connector } from '../../../../super-admin/pages/connectors/connector.model';

interface PathHop {
  fromDeviceName: string;
  toDeviceName: string;
  cableName: string;
  cableType: string;
}

const CABLE_TYPE_ABBREVIATION: Record<string, string> = {
  FIBER_OM3: 'OM3',
  FIBER_OM4: 'OM4',
  FIBER_OM5: 'OM5',
  FIBER_OS2: 'OS2',
  COPPER_CAT6A: 'Cat6A',
  DAC_COPPER: 'DAC',
  AOC: 'AOC',
};

const PACKET_HOP_DURATION_MS = 550;
const PACKET_PAUSE_AT_END_MS = 500;

// No backend path-computation endpoint exists (PathTrace is a manually-entered summary record,
// not a live trace) - this screen fetches Devices+Cables and runs its own breadth-first search
// over the cable graph client-side, which is honest given the dataset size a demo DCIM has.
// Visual language is deliberately Packet-Tracer-like: per-device-type icon badges, a network
// canvas grid, and an animated packet that hops along the traced path.
@Component({
  selector: 'app-ne-path-tracing',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './path-tracing.component.html',
  styleUrl: './path-tracing.component.css',
})
export class NePathTracingComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer', { static: true })
  private readonly graphContainer!: ElementRef<HTMLDivElement>;

  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly cableService = inject(NetworkEngineerCableService);
  private readonly connectorService = inject(NetworkEngineerConnectorService);

  protected readonly loading = signal(true);
  protected readonly devices = signal<Device[]>([]);
  protected readonly sourceDeviceId = signal<number | null>(null);
  protected readonly targetDeviceId = signal<number | null>(null);
  protected readonly sourcePorts = signal<Connector[]>([]);
  protected readonly targetPorts = signal<Connector[]>([]);

  protected readonly traced = signal(false);
  protected readonly hops = signal<PathHop[]>([]);
  protected readonly noPathFound = signal(false);

  private cy: Core | null = null;
  private allDevices: Device[] = [];
  private allCables: Cable[] = [];
  private allConnectors: Connector[] = [];
  private packetTimer: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [devices, cables, connectors] = await Promise.all([
        this.deviceService.list({ page: 0, size: 1000 }),
        this.cableService.list({ page: 0, size: 1000 }),
        this.connectorService.list({ page: 0, size: 1000 }),
      ]);
      this.allDevices = devices.content;
      this.allCables = cables.content;
      this.allConnectors = connectors.content;
      this.devices.set(devices.content);
      this.renderBaseGraph();
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.stopPacketAnimation();
    this.cy?.destroy();
  }

  protected onSourceChange(value: string): void {
    const id = value ? Number(value) : null;
    this.sourceDeviceId.set(id);
    this.sourcePorts.set(id === null ? [] : this.allConnectors.filter((c) => c.deviceId === id));
    this.resetTrace();
  }

  protected onTargetChange(value: string): void {
    const id = value ? Number(value) : null;
    this.targetDeviceId.set(id);
    this.targetPorts.set(id === null ? [] : this.allConnectors.filter((c) => c.deviceId === id));
    this.resetTrace();
  }

  protected get canTrace(): boolean {
    const source = this.sourceDeviceId();
    const target = this.targetDeviceId();
    return source !== null && target !== null && source !== target;
  }

  protected onTrace(): void {
    const source = this.sourceDeviceId();
    const target = this.targetDeviceId();
    if (source === null || target === null) {
      return;
    }

    const path = this.findShortestPath(source, target);
    this.traced.set(true);
    this.stopPacketAnimation();

    if (!path) {
      this.noPathFound.set(true);
      this.hops.set([]);
      this.highlightPath([], []);
      return;
    }

    this.noPathFound.set(false);
    const deviceById = new Map(this.allDevices.map((d) => [d.id, d]));
    this.hops.set(
      path.cables.map((cable) => ({
        fromDeviceName: deviceById.get(cable.sourceDeviceId)?.name ?? '',
        toDeviceName: deviceById.get(cable.targetDeviceId)?.name ?? '',
        cableName: cable.name,
        cableType: cable.cableType,
      })),
    );
    this.highlightPath(
      path.deviceIds,
      path.cables.map((c) => c.id),
    );
    this.startPacketAnimation(path.deviceIds);
  }

  protected onZoomIn(): void {
    if (!this.cy) return;
    this.cy.zoom({ level: this.cy.zoom() * 1.25, renderedPosition: this.viewportCenter() });
  }

  protected onZoomOut(): void {
    if (!this.cy) return;
    this.cy.zoom({ level: this.cy.zoom() * 0.8, renderedPosition: this.viewportCenter() });
  }

  protected onFitView(): void {
    this.cy?.fit(undefined, 40);
  }

  private viewportCenter(): { x: number; y: number } {
    const el = this.graphContainer.nativeElement;
    return { x: el.clientWidth / 2, y: el.clientHeight / 2 };
  }

  private resetTrace(): void {
    this.traced.set(false);
    this.noPathFound.set(false);
    this.hops.set([]);
    this.stopPacketAnimation();
    this.highlightPath([], []);
  }

  // Undirected BFS over the cable graph - cables have no inherent direction for tracing
  // purposes, a link can be traversed from either end.
  private findShortestPath(
    sourceId: number,
    targetId: number,
  ): { deviceIds: number[]; cables: Cable[] } | null {
    const adjacency = new Map<number, { neighborId: number; cable: Cable }[]>();
    for (const cable of this.allCables) {
      if (!adjacency.has(cable.sourceDeviceId)) {
        adjacency.set(cable.sourceDeviceId, []);
      }
      if (!adjacency.has(cable.targetDeviceId)) {
        adjacency.set(cable.targetDeviceId, []);
      }
      adjacency.get(cable.sourceDeviceId)!.push({ neighborId: cable.targetDeviceId, cable });
      adjacency.get(cable.targetDeviceId)!.push({ neighborId: cable.sourceDeviceId, cable });
    }

    const visited = new Set<number>([sourceId]);
    const queue: number[] = [sourceId];
    const cameFrom = new Map<number, { deviceId: number; cable: Cable }>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) {
        break;
      }
      for (const { neighborId, cable } of adjacency.get(current) ?? []) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          cameFrom.set(neighborId, { deviceId: current, cable });
          queue.push(neighborId);
        }
      }
    }

    if (!visited.has(targetId)) {
      return null;
    }

    const deviceIds: number[] = [targetId];
    const cables: Cable[] = [];
    let cursor = targetId;
    while (cursor !== sourceId) {
      const step = cameFrom.get(cursor);
      if (!step) {
        return null;
      }
      cables.unshift(step.cable);
      deviceIds.unshift(step.deviceId);
      cursor = step.deviceId;
    }
    return { deviceIds, cables };
  }

  private renderBaseGraph(): void {
    const nodeElements: ElementDefinition[] = this.allDevices.map((device) => ({
      group: 'nodes',
      data: { id: `d${device.id}`, label: device.name, deviceType: device.deviceType },
    }));
    const edgeElements: ElementDefinition[] = this.allCables.map((cable) => ({
      group: 'edges',
      data: {
        id: `c${cable.id}`,
        source: `d${cable.sourceDeviceId}`,
        target: `d${cable.targetDeviceId}`,
        label: CABLE_TYPE_ABBREVIATION[cable.cableType] ?? '',
      },
    }));

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
              deviceBadgeColor(el.data('deviceType') as Device['deviceType']),
            'background-image': (el: NodeSingular) =>
              deviceIconDataUri(el.data('deviceType') as Device['deviceType']),
            'background-fit': 'contain',
            'background-width': '62%',
            'background-height': '62%',
            label: 'data(label)',
            color: resolveCssColor('var(--awb-on-surface)'),
            'font-size': '9px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-max-width': '72px',
            'text-wrap': 'ellipsis',
            width: 36,
            height: 36,
            shape: 'round-rectangle',
            'border-width': 2,
            'border-color': resolveCssColor('var(--awb-surface)'),
          },
        },
        {
          // The grid layout places devices by list order, not topology, so a cable can easily
          // span two cells with an unrelated device sitting in the cell between them. A straight
          // line there reads as if it connects to that middle device too - an arc keeps it
          // unambiguous, the same way Packet Tracer never draws a wire through another device.
          selector: 'edge',
          style: {
            width: 2,
            'line-color': resolveCssColor('var(--awb-border)'),
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [32],
            'control-point-weights': [0.5],
            label: 'data(label)',
            'font-size': '8px',
            color: resolveCssColor('var(--awb-on-surface-muted)'),
            'text-background-color': resolveCssColor('var(--awb-surface)'),
            'text-background-opacity': 1,
            'text-background-padding': '2px',
          },
        },
        {
          selector: 'node.path-highlight',
          style: {
            'border-width': 3,
            'border-color': resolveCssColor('var(--chart-series-1)'),
            width: 44,
            height: 44,
          },
        },
        {
          selector: 'edge.path-highlight',
          style: {
            'line-color': resolveCssColor('var(--chart-series-1)'),
            width: 4,
          },
        },
        {
          selector: 'node.packet-node',
          style: {
            'background-color': '#fff',
            'background-image': 'none',
            'border-width': 2,
            'border-color': resolveCssColor('var(--chart-series-1)'),
            width: 12,
            height: 12,
            shape: 'ellipse',
            label: '',
            'z-index': 999,
          },
        },
      ],
      layout: {
        name: 'grid',
        avoidOverlap: true,
        avoidOverlapPadding: 28,
        padding: 30,
        condense: true,
        cols: this.gridColumnCount(nodeElements.length),
      },
    });
  }

  // Cytoscape's default grid column count is based purely on node count (roughly sqrt(n)),
  // which packs labels far closer than their rendered text width - causing neighboring device
  // names to overlap. Deriving columns from the actual container width instead guarantees each
  // column is wide enough for a (now ellipsis-truncated) label.
  private gridColumnCount(nodeCount: number): number {
    const containerWidth = this.graphContainer.nativeElement.clientWidth || 800;
    const minColumnWidth = 110;
    return Math.max(3, Math.min(nodeCount, Math.floor(containerWidth / minColumnWidth)));
  }

  private highlightPath(deviceIds: number[], cableIds: number[]): void {
    if (!this.cy) {
      return;
    }
    this.cy.elements().removeClass('path-highlight');
    for (const id of deviceIds) {
      this.cy.getElementById(`d${id}`).addClass('path-highlight');
    }
    for (const id of cableIds) {
      this.cy.getElementById(`c${id}`).addClass('path-highlight');
    }
    if (deviceIds.length > 0) {
      const collection = this.cy.elements('.path-highlight');
      this.cy.animate({ fit: { eles: collection, padding: 60 } }, { duration: 300 });
    }
  }

  // Simulates a packet hopping device-to-device along the traced path, looping continuously -
  // the closest honest equivalent to Packet Tracer's simulation-mode packet animation, given
  // there's no real traffic to observe.
  private startPacketAnimation(deviceIds: number[]): void {
    if (!this.cy || deviceIds.length < 2) {
      return;
    }
    const cy = this.cy;
    cy.getElementById('packet').remove();

    const firstPos = cy.getElementById(`d${deviceIds[0]}`).position();
    cy.add({
      group: 'nodes',
      data: { id: 'packet' },
      position: { x: firstPos.x, y: firstPos.y },
      classes: 'packet-node',
      grabbable: false,
      selectable: false,
      pannable: true,
    });

    let hopIndex = 0;
    const step = (): void => {
      const packet = cy.getElementById('packet');
      if (!packet.length) {
        return;
      }
      hopIndex += 1;
      const atEnd = hopIndex >= deviceIds.length;
      const targetDeviceId = deviceIds[atEnd ? 0 : hopIndex];
      const nextPos = cy.getElementById(`d${targetDeviceId}`).position();
      if (atEnd) {
        hopIndex = 0;
        packet.position({ x: firstPos.x, y: firstPos.y });
        this.packetTimer = setTimeout(step, PACKET_PAUSE_AT_END_MS);
        return;
      }
      packet.animate(
        { position: { x: nextPos.x, y: nextPos.y } },
        {
          duration: PACKET_HOP_DURATION_MS,
          complete: () => {
            this.packetTimer = setTimeout(step, 80);
          },
        },
      );
    };
    this.packetTimer = setTimeout(step, PACKET_PAUSE_AT_END_MS);
  }

  private stopPacketAnimation(): void {
    if (this.packetTimer !== null) {
      clearTimeout(this.packetTimer);
      this.packetTimer = null;
    }
    this.cy?.getElementById('packet').remove();
  }

  protected isPortFree(port: Connector): boolean {
    return port.status === 'SPARE';
  }
}
