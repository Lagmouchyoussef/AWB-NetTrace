import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChartDatum } from '../../../../core/components/charts/chart-data.model';
import { StatChartComponent } from '../../../../core/components/charts/stat-chart/stat-chart.component';
import { NetworkEngineerConnectorService } from '../../../../core/services/network-engineer-connector.service';
import { NetworkEngineerDeviceService } from '../../../../core/services/network-engineer-device.service';
import { NetworkEngineerNetworkRoleService } from '../../../../core/services/network-engineer-network-role.service';
import { NetworkEngineerOverlayNetworkService } from '../../../../core/services/network-engineer-overlay-network.service';

const ROLE_COLOR_ROLES: Record<string, string> = {
  SUPER_SPINE: 'series-1',
  SPINE: 'good',
  LEAF: 'ordinal-3',
  BORDER_LEAF: 'serious',
  TOR_SWITCH: 'ordinal-2',
  ROUTE_REFLECTOR: 'critical',
};

// KPIs are composed client-side from existing entity endpoints (no dedicated dashboard-summary
// endpoint for this role) - port occupancy comes straight off Connector.status, VLAN count is
// the overlay-network count (the closest entity this schema has to a distinct "VLAN"), and
// device-by-role comes from grouping NetworkRole entries by roleType.
@Component({
  selector: 'app-ne-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe, StatChartComponent],
  templateUrl: './network-engineer-dashboard.component.html',
  styleUrl: './network-engineer-dashboard.component.css',
})
export class NetworkEngineerDashboardComponent implements OnInit {
  private readonly connectorService = inject(NetworkEngineerConnectorService);
  private readonly deviceService = inject(NetworkEngineerDeviceService);
  private readonly networkRoleService = inject(NetworkEngineerNetworkRoleService);
  private readonly overlayNetworkService = inject(NetworkEngineerOverlayNetworkService);
  private readonly translateService = inject(TranslateService);

  protected readonly loading = signal(true);

  protected readonly portsTotal = signal(0);
  protected readonly portsFree = signal(0);
  protected readonly vlanCount = signal(0);
  protected readonly deviceCount = signal(0);
  protected readonly rolesByType = signal<Record<string, number>>({});

  protected readonly portsUsed = computed(() => this.portsTotal() - this.portsFree());
  protected readonly portsUsedPercent = computed(() => {
    const total = this.portsTotal();
    return total === 0 ? 0 : Math.round((this.portsUsed() / total) * 100);
  });

  protected readonly deviceRoleData = computed<ChartDatum[]>(() =>
    Object.entries(this.rolesByType()).map(([roleType, count]) => ({
      label: this.translateService.instant(`networkRoles.roleType.${roleType}`),
      count,
      colorRole: ROLE_COLOR_ROLES[roleType],
    })),
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [portsTotal, portsFree, vlanCount, deviceCount, roles] = await Promise.all([
        this.connectorService.list({ page: 0, size: 1 }),
        this.connectorService.list({ page: 0, size: 1, status: 'SPARE' }),
        this.overlayNetworkService.list({ page: 0, size: 1 }),
        this.deviceService.list({ page: 0, size: 1 }),
        this.networkRoleService.list({ page: 0, size: 1000 }),
      ]);

      this.portsTotal.set(portsTotal.totalElements);
      this.portsFree.set(portsFree.totalElements);
      this.vlanCount.set(vlanCount.totalElements);
      this.deviceCount.set(deviceCount.totalElements);

      const grouped: Record<string, number> = {};
      for (const role of roles.content) {
        grouped[role.roleType] = (grouped[role.roleType] ?? 0) + 1;
      }
      this.rolesByType.set(grouped);
    } finally {
      this.loading.set(false);
    }
  }
}
