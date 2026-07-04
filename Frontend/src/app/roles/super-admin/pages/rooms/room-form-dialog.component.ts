import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DatacenterService } from '../../../../core/services/datacenter.service';
import { RoomService } from '../../../../core/services/room.service';
import { Datacenter } from '../datacenters/datacenter.model';
import {
  COOLING_TYPES,
  ROOM_STATUSES,
  ROOM_TYPES,
  Room,
  CoolingType,
  RoomStatus,
  RoomType,
} from './room.model';

@Component({
  selector: 'app-room-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './room-form-dialog.component.html',
  styleUrl: './room-form-dialog.component.css',
})
export class RoomFormDialogComponent implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly datacenterService = inject(DatacenterService);
  private readonly dialogRef = inject(MatDialogRef<RoomFormDialogComponent, boolean>);
  protected readonly data = inject<Room | null>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data !== null;
  protected readonly roomTypes = ROOM_TYPES;
  protected readonly coolingTypes = COOLING_TYPES;
  protected readonly statuses = ROOM_STATUSES;
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
    roomType: new FormControl<RoomType>(this.data?.roomType ?? 'SERVER_ROOM', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    floor: new FormControl(this.data?.floor ?? ''),
    areaSqm: new FormControl<number | null>(this.data?.areaSqm ?? null),
    maxPowerKw: new FormControl<number | null>(this.data?.maxPowerKw ?? null),
    coolingType: new FormControl<CoolingType>(this.data?.coolingType ?? 'CRAC', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<RoomStatus>(this.data?.status ?? 'ACTIVE', {
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
        await this.roomService.update(this.data.id, {
          ...value,
          datacenterId: value.datacenterId!,
        });
      } else {
        await this.roomService.create({ ...value, datacenterId: value.datacenterId! });
      }
      this.dialogRef.close(true);
    } catch {
      this.errorKey.set('rooms.saveError');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
