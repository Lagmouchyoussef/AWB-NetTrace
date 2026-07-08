import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnologyCatalogEntry } from '../../../../super-admin/pages/technology-catalog/technology-catalog-entry.model';

@Component({
  selector: 'app-ne-technology-catalog-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslatePipe],
  templateUrl: './technology-catalog-detail-dialog.component.html',
  styleUrl: './technology-catalog-detail-dialog.component.css',
})
export class NeTechnologyCatalogDetailDialogComponent {
  protected readonly data = inject<TechnologyCatalogEntry>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NeTechnologyCatalogDetailDialogComponent>);

  protected close(): void {
    this.dialogRef.close();
  }
}
