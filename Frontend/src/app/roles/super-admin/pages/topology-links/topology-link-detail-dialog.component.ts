import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TopologyLink } from './topology-link.model';

@Component({
  selector: 'app-topology-link-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './topology-link-detail-dialog.component.html',
  styleUrl: './topology-link-detail-dialog.component.css',
})
export class TopologyLinkDetailDialogComponent {
  protected readonly data = inject<TopologyLink>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TopologyLinkDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
