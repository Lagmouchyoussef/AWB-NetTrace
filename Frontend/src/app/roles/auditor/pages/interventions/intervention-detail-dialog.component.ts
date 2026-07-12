import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Intervention } from '../../../super-admin/pages/interventions/intervention.model';

@Component({
  selector: 'app-auditor-intervention-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './intervention-detail-dialog.component.html',
  styleUrl: './intervention-detail-dialog.component.css',
})
export class AuditorInterventionDetailDialogComponent {
  protected readonly data = inject<Intervention>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AuditorInterventionDetailDialogComponent>);

  protected formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleString() : '';
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
