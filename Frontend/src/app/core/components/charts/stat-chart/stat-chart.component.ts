import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ChartDatum } from '../chart-data.model';

export type ChartMode = 'bar' | 'line' | 'donut' | 'table';

// Fallback rotation used only when a datum has no explicit colorRole (i.e. the data
// isn't a status/severity scale) — e.g. the entity-type breakdown or infra health,
// where the donut still needs visually distinct slices per category.
const AUTO_COLOR_ROLES = ['series-1', 'good', 'serious', 'ordinal-3', 'critical', 'ordinal-5'];

const VIEW_WIDTH = 520;
const VIEW_HEIGHT = 220;
const PAD_LEFT = 4;
const PAD_RIGHT = 4;
const PAD_TOP = 10;
const PAD_BOTTOM = 28;

const DONUT_SIZE = 180;
const DONUT_RADIUS = 70;
const DONUT_STROKE = 26;

interface PlottedPoint {
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
  label: string;
  count: number;
}

interface PlottedBar extends ChartDatum {
  percent: number;
  resolvedColorRole: string;
}

interface DonutSegment extends ChartDatum {
  percentOfTotal: number;
  resolvedColorRole: string;
  dashArray: string;
  dashOffset: number;
}

@Component({
  selector: 'app-stat-chart',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './stat-chart.component.html',
  styleUrl: './stat-chart.component.css',
})
export class StatChartComponent {
  readonly data = input.required<ChartDatum[]>();
  readonly titleKey = input.required<string>();
  readonly initialMode = input<ChartMode>('bar');
  readonly availableModes = input<ChartMode[]>(['bar', 'line', 'donut', 'table']);
  readonly defaultColorRole = input<string>('series-1');
  readonly showLegend = input<boolean>(false);

  protected readonly mode = signal<ChartMode>(this.initialMode());

  protected readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  protected readonly baselineY = VIEW_HEIGHT - PAD_BOTTOM;
  protected readonly donutViewBox = `0 0 ${DONUT_SIZE} ${DONUT_SIZE}`;
  protected readonly donutCenter = DONUT_SIZE / 2;
  protected readonly donutRadius = DONUT_RADIUS;
  protected readonly donutStroke = DONUT_STROKE;
  protected readonly donutCircumference = 2 * Math.PI * DONUT_RADIUS;

  protected readonly hoverIndex = signal<number | null>(null);

  protected setMode(mode: ChartMode): void {
    this.mode.set(mode);
  }

  protected onHover(index: number): void {
    this.hoverIndex.set(index);
  }

  protected onLeave(): void {
    this.hoverIndex.set(null);
  }

  private colorRoleFor(index: number, datum: ChartDatum): string {
    if (datum.colorRole) {
      return datum.colorRole;
    }
    // Only auto-rotate when NO datum in the series carries an explicit role — a series
    // with per-datum roles (priority/severity/health) should never be recolored.
    const anyExplicit = this.data().some((d) => d.colorRole);
    if (anyExplicit) {
      return this.defaultColorRole();
    }
    return this.data().length > 1
      ? AUTO_COLOR_ROLES[index % AUTO_COLOR_ROLES.length]
      : this.defaultColorRole();
  }

  protected readonly maxValue = computed(() => Math.max(1, ...this.data().map((d) => d.count)));

  protected readonly total = computed(() => this.data().reduce((sum, d) => sum + d.count, 0));

  // --- Bar mode ---
  protected readonly bars = computed<PlottedBar[]>(() => {
    const max = this.maxValue();
    return this.data().map((d, i) => ({
      ...d,
      percent: (d.count / max) * 100,
      resolvedColorRole: this.colorRoleFor(i, d),
    }));
  });

  // --- Line mode ---
  protected readonly points = computed<PlottedPoint[]>(() => {
    const data = this.data();
    if (data.length === 0) {
      return [];
    }
    const plotWidth = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
    const plotHeight = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;
    const max = this.maxValue();
    return data.map((d, i) => {
      const x =
        data.length === 1
          ? PAD_LEFT + plotWidth / 2
          : PAD_LEFT + (i / (data.length - 1)) * plotWidth;
      const y = PAD_TOP + plotHeight - (d.count / max) * plotHeight;
      return {
        x,
        y,
        xPercent: (x / VIEW_WIDTH) * 100,
        yPercent: (y / VIEW_HEIGHT) * 100,
        label: d.label,
        count: d.count,
      };
    });
  });

  protected readonly linePath = computed(() =>
    this.points()
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) {
      return '';
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    return (
      `M${first.x},${this.baselineY} ` +
      pts.map((p) => `L${p.x},${p.y}`).join(' ') +
      ` L${last.x},${this.baselineY} Z`
    );
  });

  protected readonly labelStep = computed(() => Math.max(1, Math.ceil(this.points().length / 6)));

  protected readonly hoveredPoint = computed(() => {
    const index = this.hoverIndex();
    return index === null ? null : (this.points()[index] ?? null);
  });

  // --- Donut mode ---
  protected readonly donutSegments = computed<DonutSegment[]>(() => {
    const total = this.total();
    const circumference = this.donutCircumference;
    let cumulative = 0;
    return this.data().map((d, i) => {
      const fraction = total > 0 ? d.count / total : 0;
      const dash = fraction * circumference;
      const segment: DonutSegment = {
        ...d,
        percentOfTotal: Math.round(fraction * 1000) / 10,
        resolvedColorRole: this.colorRoleFor(i, d),
        dashArray: `${dash} ${circumference - dash}`,
        dashOffset: -cumulative,
      };
      cumulative += dash;
      return segment;
    });
  });
}
