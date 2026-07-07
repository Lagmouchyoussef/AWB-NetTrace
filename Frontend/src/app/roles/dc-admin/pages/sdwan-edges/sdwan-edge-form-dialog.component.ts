import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DcAdminDatacenterService } from '../../../../core/services/dc-admin-datacenter.service';
import { DcAdminSdwanEdgeService } from '../../../../core/services/dc-admin-sdwan-edge.service';
import { Datacenter } from '../../../super-admin/pages/datacenters/datacenter.model';
import {
  SDWAN_EDGE_STATUSES,
  SdwanEdge,
  SdwanEdgeStatus,
} from '../../../super-admin/pages/sdwan-edges/sdwan-edge.model';

@Component({
  selector: 'app-dc-admin-sdwan-edge-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './sdwan-edge-form-dialog.component.html',
  styleUrl: './sdwan-edge-form-dialog.component.css',
})
export class DcAdminSdwanEdgeFormDialogComponent implements OnInit {
  private readonly sdwanEdgeService = inject(DcAdminSdwanEdgeService);
  private readonly datacenterService = inject(DcAdminDatacenterService);
  private readonly dialogRef = inject(MatDialogRef<DcAdminSdwanEdgeFormDialogComponent, boolean>);
  protected readonly data = inject<SdwanEdge | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly statuses = SDWAN_EDGE_STATUSES;
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
    vendor: new FormControl(this.data?.vendor ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    model: new FormControl(this.data?.model ?? ''),
    wanLinkCount: new FormControl<number | null>(this.data?.wanLinkCount ?? 1, {
      validators: [Validators.required],
    }),
    managementIp: new FormControl(this.data?.managementIp ?? ''),
    status: new FormControl<SdwanEdgeStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.sdwanEdgeService.update(this.data.id, {
          ...value,
          datacenterId: value.datacenterId!,
          wanLinkCount: value.wanLinkCount!,
        });
      } else {
        await this.sdwanEdgeService.create({
          ...value,
          datacenterId: value.datacenterId!,
          wanLinkCount: value.wanLinkCount!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('sdwanEdges.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
