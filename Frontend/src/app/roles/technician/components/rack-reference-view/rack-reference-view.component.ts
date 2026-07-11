import {
  Component,
  ElementRef,
  Injector,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { deviceBadgeColorToken, deviceIconDataUri } from '../../../../core/utils/device-icons';
import { DeviceType } from '../../../super-admin/pages/devices/device.model';
import { RackElevation, RackElevationDevice } from '../../technician-execution.model';

const ROW_HEIGHT_PX = 22;
const RACK_SHELL_VISIBLE_HEIGHT_PX = 420;

interface PositionedDevice extends RackElevationDevice {
  topPx: number;
  heightPx: number;
}

// Read-only, no interaction beyond scroll - a technician confirms by eye that they are in front
// of the right rack and the right U slot before touching anything. U1 is the bottom of the rack
// (standard datacenter convention), so higher positionUStart renders higher up visually.
@Component({
  selector: 'app-rack-reference-view',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './rack-reference-view.component.html',
  styleUrl: './rack-reference-view.component.css',
})
export class RackReferenceViewComponent {
  @ViewChild('rackShell') private readonly rackShellRef?: ElementRef<HTMLDivElement>;
  private readonly injector = inject(Injector);

  readonly elevation = input<RackElevation | null>(null);
  readonly loading = input<boolean>(false);

  protected readonly rackHeightPx = computed(
    () => (this.elevation()?.rackHeightU ?? 0) * ROW_HEIGHT_PX,
  );

  protected readonly positionedDevices = computed<PositionedDevice[]>(() => {
    const data = this.elevation();
    if (!data) {
      return [];
    }
    return data.devices.map((device) => ({
      ...device,
      topPx: (data.rackHeightU - (device.positionUStart + device.heightU - 1)) * ROW_HEIGHT_PX,
      heightPx: device.heightU * ROW_HEIGHT_PX,
    }));
  });

  // The target device is frequently nowhere near the top of a full-height rack (e.g. U1-U2 of a
  // 42U rack), which would otherwise sit below the fold of the scrollable rack-shell - the one
  // thing this view exists to show has to be visible without the technician hunting for it.
  // afterNextRender (not a plain effect) because the #rackShell element only exists once the
  // @if(elevation()) block turns true - deferring to the next render guarantees the ViewChild
  // query has already been refreshed against that newly-rendered DOM.
  constructor() {
    effect(() => {
      const target = this.positionedDevices().find((device) => device.target);
      if (!target) {
        return;
      }
      afterNextRender(
        {
          read: () => {
            const shell = this.rackShellRef?.nativeElement;
            if (!shell) {
              return;
            }
            const centerOffset =
              target.topPx + target.heightPx / 2 - RACK_SHELL_VISIBLE_HEIGHT_PX / 2;
            shell.scrollTop = Math.max(0, centerOffset);
          },
        },
        { injector: this.injector },
      );
    });
  }

  protected iconFor(deviceType: string): string {
    return deviceIconDataUri(deviceType as DeviceType);
  }

  protected colorFor(deviceType: string): string {
    return deviceBadgeColorToken(deviceType as DeviceType);
  }
}
