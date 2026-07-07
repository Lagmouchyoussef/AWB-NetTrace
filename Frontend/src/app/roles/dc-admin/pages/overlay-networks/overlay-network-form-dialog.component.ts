import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminDatacenterService } from '../../../../core/services/dc-admin-datacenter.service';
import { DcAdminOverlayNetworkService } from '../../../../core/services/dc-admin-overlay-network.service';
import { Datacenter } from '../../../super-admin/pages/datacenters/datacenter.model';
import {
  OVERLAY_NETWORK_STATUSES,
  OVERLAY_TYPES,
  OverlayNetwork,
  OverlayNetworkStatus,
  OverlayType,
} from '../../../super-admin/pages/overlay-networks/overlay-network.model';

@Component({
  selector: 'app-dc-admin-overlay-network-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './overlay-network-form-dialog.component.html',
  styleUrl: './overlay-network-form-dialog.component.css',
})
export class DcAdminOverlayNetworkFormDialogComponent implements OnInit {
  private readonly overlayNetworkService = inject(DcAdminOverlayNetworkService);
  private readonly datacenterService = inject(DcAdminDatacenterService);
  private readonly dialogRef = inject(
    MatDialogRef<DcAdminOverlayNetworkFormDialogComponent, boolean>,
  );
  protected readonly data = inject<OverlayNetwork | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly overlayTypes = OVERLAY_TYPES;
  protected readonly statuses = OVERLAY_NETWORK_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly datacenters = signal<Datacenter[]>([]);

  protected readonly form = new FormGroup({
    datacenterId: new FormControl<number | null>(this.data?.datacenterId ?? null, {
      validators: [Validators.required],
    }),
    name: new FormControl(this.data?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    code: new FormControl(this.data?.code ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    vni: new FormControl<number | null>(this.data?.vni ?? null, {
      validators: [Validators.required],
    }),
    overlayType: new FormControl<OverlayType>(this.data?.overlayType ?? 'L2_EVPN', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    vlanId: new FormControl<number | null>(this.data?.vlanId ?? null),
    vrfName: new FormControl(this.data?.vrfName ?? ''),
    routeDistinguisher: new FormControl(this.data?.routeDistinguisher ?? ''),
    routeTargets: new FormControl(this.data?.routeTargets ?? ''),
    status: new FormControl<OverlayNetworkStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.datacenterService.list({ page: 0, size: 1000 });
    this.datacenters.set(result.content);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorKey.set(null);
    const value = this.form.getRawValue();
    try {
      if (this.data) {
        await this.overlayNetworkService.update(this.data.id, {
          ...value,
          datacenterId: value.datacenterId!,
          vni: value.vni!,
        });
      } else {
        await this.overlayNetworkService.create({
          ...value,
          datacenterId: value.datacenterId!,
          vni: value.vni!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('overlayNetworks.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
