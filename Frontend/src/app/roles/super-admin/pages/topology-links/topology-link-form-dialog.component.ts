import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NetworkRoleService } from '../../../../core/services/network-role.service';
import { TopologyLinkService } from '../../../../core/services/topology-link.service';
import { NetworkRole } from '../network-roles/network-role.model';
import {
  TOPOLOGY_LINK_STATUSES,
  TOPOLOGY_LINK_TYPES,
  TopologyLink,
  TopologyLinkStatus,
  TopologyLinkType,
} from './topology-link.model';

@Component({
  selector: 'app-topology-link-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './topology-link-form-dialog.component.html',
  styleUrl: './topology-link-form-dialog.component.css',
})
export class TopologyLinkFormDialogComponent implements OnInit {
  private readonly topologyLinkService = inject(TopologyLinkService);
  private readonly networkRoleService = inject(NetworkRoleService);
  private readonly dialogRef = inject(MatDialogRef<TopologyLinkFormDialogComponent, boolean>);
  protected readonly data = inject<TopologyLink | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly linkTypes = TOPOLOGY_LINK_TYPES;
  protected readonly statuses = TOPOLOGY_LINK_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly roles = signal<NetworkRole[]>([]);

  protected readonly form = new FormGroup({
    sourceRoleId: new FormControl<number | null>(this.data?.sourceRoleId ?? null, {
      validators: [Validators.required],
    }),
    targetRoleId: new FormControl<number | null>(this.data?.targetRoleId ?? null, {
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
    linkType: new FormControl<TopologyLinkType>(this.data?.linkType ?? 'FABRIC_UPLINK', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    speedGbps: new FormControl<number | null>(this.data?.speedGbps ?? 100, {
      validators: [Validators.required],
    }),
    status: new FormControl<TopologyLinkStatus>(this.data?.status ?? 'UP', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.networkRoleService.list({ page: 0, size: 1000 });
    this.roles.set(result.content);
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
        await this.topologyLinkService.update(this.data.id, {
          ...value,
          sourceRoleId: value.sourceRoleId!,
          targetRoleId: value.targetRoleId!,
          speedGbps: value.speedGbps!,
        });
      } else {
        await this.topologyLinkService.create({
          ...value,
          sourceRoleId: value.sourceRoleId!,
          targetRoleId: value.targetRoleId!,
          speedGbps: value.speedGbps!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('topologyLinks.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
