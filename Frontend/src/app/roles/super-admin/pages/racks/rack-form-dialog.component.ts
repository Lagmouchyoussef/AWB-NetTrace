import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { RoomService } from '../../../../core/services/room.service';
import { RackService } from '../../../../core/services/rack.service';
import { Room } from '../rooms/room.model';
import { RACK_CONTAINMENTS, RACK_STATUSES, Rack, RackContainment, RackStatus } from './rack.model';

@Component({
  selector: 'app-rack-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './rack-form-dialog.component.html',
  styleUrl: './rack-form-dialog.component.css',
})
export class RackFormDialogComponent implements OnInit {
  private readonly rackService = inject(RackService);
  private readonly roomService = inject(RoomService);
  private readonly dialogRef = inject(MatDialogRef<RackFormDialogComponent, boolean>);
  protected readonly data = inject<Rack | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly containments = RACK_CONTAINMENTS;
  protected readonly statuses = RACK_STATUSES;
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly rooms = signal<Room[]>([]);

  protected readonly form = new FormGroup({
    roomId: new FormControl<number | null>(this.data?.roomId ?? null, {
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
    heightU: new FormControl<number | null>(this.data?.heightU ?? 42, {
      validators: [Validators.required],
    }),
    powerCapacityKw: new FormControl<number | null>(this.data?.powerCapacityKw ?? null, {
      validators: [Validators.required],
    }),
    currentPowerDrawKw: new FormControl<number | null>(this.data?.currentPowerDrawKw ?? null),
    maxWeightKg: new FormControl<number | null>(this.data?.maxWeightKg ?? null),
    containment: new FormControl<RackContainment>(this.data?.containment ?? 'HOT_AISLE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<RackStatus>(this.data?.status ?? 'ACTIVE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notes: new FormControl(this.data?.notes ?? ''),
  });

  async ngOnInit(): Promise<void> {
    const result = await this.roomService.list({ page: 0, size: 1000 });
    this.rooms.set(result.content);
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
        await this.rackService.update(this.data.id, {
          ...value,
          roomId: value.roomId!,
          heightU: value.heightU!,
          powerCapacityKw: value.powerCapacityKw!,
        });
      } else {
        await this.rackService.create({
          ...value,
          roomId: value.roomId!,
          heightU: value.heightU!,
          powerCapacityKw: value.powerCapacityKw!,
        });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('racks.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
