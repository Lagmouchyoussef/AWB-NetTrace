import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslatedPaginatorIntl extends MatPaginatorIntl {
  private readonly translateService = inject(TranslateService);

  constructor() {
    super();
    this.translateService.onLangChange.subscribe(() => this.updateLabels());
    this.updateLabels();
  }

  private updateLabels(): void {
    this.itemsPerPageLabel = this.translateService.instant('common.itemsPerPage');
    this.nextPageLabel = this.translateService.instant('common.nextPage');
    this.previousPageLabel = this.translateService.instant('common.previousPage');
    this.firstPageLabel = this.translateService.instant('common.firstPage');
    this.lastPageLabel = this.translateService.instant('common.lastPage');
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const of = this.translateService.instant('common.of');
      if (length === 0 || pageSize === 0) {
        return `0 ${of} ${length}`;
      }
      const start = page * pageSize;
      const end = Math.min(start + pageSize, length);
      return `${start + 1} – ${end} ${of} ${length}`;
    };
    this.changes.next();
  }
}
