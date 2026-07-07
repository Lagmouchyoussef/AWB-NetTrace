import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminSdwanEdgeService } from '../../../../core/services/dc-admin-sdwan-edge.service';
import { DcAdminOverlayTunnelService } from '../../../../core/services/dc-admin-overlay-tunnel.service';
import { SdwanEdge } from '../../../super-admin/pages/sdwan-edges/sdwan-edge.model';
import {
  OVERLAY_TUNNEL_STATUSES,
  OVERLAY_TUNNEL_TYPES,
  OverlayTunnel,
  OverlayTunnelStatus,
  OverlayTunnelType,
} from '../../../super-admin/pages/overlay-tunnels/overlay-tunnel.model';

@Component({
  selector: 'app-dc-admin-overlay-tunnel-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './overlay-tunnel-form-dialog.component.html',
  styleUrl: './overlay-tunnel-form-dialog.component.css',
})
export class DcAdminOverlayTunnelFormDialogComponent implements OnInit {
  private readonly overlayTunnelService = inject(DcAdminOverlayTunnelService);
  private readonly sdwanEdgeService = inject(DcAdminSdwanEdgeService);
  private readonly dialogRef = inject(
    MatDialogRef<DcAdminOverlayTunnelFormDialogComponent, boolean>,
  );
  protected readonly data = inject<OverlayTunnel | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly tunnelTypes = OVERLAY_TUNNEL_TYPES;
  protected readonly statuses = OVERLAY_TUNNEL_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly edges = signal<SdwanEdge[]>([]);

  protected readonly form = new FormGroup({
    sourceEdgeId: new FormControl<number | null>(this.data?.sourceEdgeId ?? null, {
      validators: [Validators.required],
    }),
    targetEdgeId: new FormControl<number | null>(this.data?.targetEdgeId ?? null, {
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
    tunnelType: new FormControl<OverlayTunnelType>(this.data?.tunnelType ?? 'IPSEC', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bandwidthMbps: new FormControl<number | null>(this.data?.bandwidthMbps ?? 100, {
      validators: [Validators.required],
    }),
    status: new FormControl<OverlayTunnelStatus>(this.data?.status ?? 'UP', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.sdwanEdgeService.list({ page: 0, size: 1000 });
    this.edges.set(result.content);
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
        await this.overlayTunnelService.update(this.data.id, {
          ...value,
          sourceEdgeId: value.sourceEdgeId!,
          targetEdgeId: value.targetEdgeId!,
          bandwidthMbps: value.bandwidthMbps!,
        });
      } else {
        await this.overlayTunnelService.create({
          ...value,
          sourceEdgeId: value.sourceEdgeId!,
          targetEdgeId: value.targetEdgeId!,
          bandwidthMbps: value.bandwidthMbps!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('overlayTunnels.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
