import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TechnicianInterventionService } from '../../../../core/services/technician-intervention.service';
import {
  Intervention,
  InterventionStatus,
} from '../../../super-admin/pages/interventions/intervention.model';
import { InterventionCardComponent } from '../../components/intervention-card/intervention-card.component';

type StatusFilter = InterventionStatus | 'ALL';

const PAGE_SIZE = 10;

const FILTER_CHIPS: { value: StatusFilter; labelKey: string }[] = [
  { value: 'ALL', labelKey: 'technician.myInterventions.filters.all' },
  { value: 'SCHEDULED', labelKey: 'technician.myInterventions.filters.toDo' },
  { value: 'IN_PROGRESS', labelKey: 'technician.myInterventions.filters.inProgress' },
  { value: 'COMPLETED', labelKey: 'technician.myInterventions.filters.done' },
];

// Full personal history, filterable by status via large toggle chips (not a dropdown) per the
// field-use brief - a card list like Home, never the generic admin DataTableComponent, matching
// the precedent Network Engineer's "My Requests" already set for personal-scoped, non-CRUD data.
@Component({
  selector: 'app-technician-my-interventions',
  standalone: true,
  imports: [TranslatePipe, InterventionCardComponent],
  templateUrl: './my-interventions.component.html',
  styleUrl: './my-interventions.component.css',
})
export class TechnicianMyInterventionsComponent implements OnInit {
  private readonly interventionService = inject(TechnicianInterventionService);

  protected readonly chips = FILTER_CHIPS;
  protected readonly activeFilter = signal<StatusFilter>('ALL');
  protected readonly interventions = signal<Intervention[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly hasMore = signal(false);
  private pageIndex = 0;

  async ngOnInit(): Promise<void> {
    await this.loadFirstPage();
  }

  protected async onFilterChange(filter: StatusFilter): Promise<void> {
    if (filter === this.activeFilter()) {
      return;
    }
    this.activeFilter.set(filter);
    await this.loadFirstPage();
  }

  protected async onLoadMore(): Promise<void> {
    this.loadingMore.set(true);
    try {
      this.pageIndex += 1;
      const page = await this.fetchPage(this.pageIndex);
      this.interventions.set([...this.interventions(), ...page.content]);
      this.hasMore.set(this.interventions().length < page.totalElements);
    } finally {
      this.loadingMore.set(false);
    }
  }

  private async loadFirstPage(): Promise<void> {
    this.loading.set(true);
    this.pageIndex = 0;
    try {
      const page = await this.fetchPage(0);
      this.interventions.set(page.content);
      this.hasMore.set(page.content.length < page.totalElements);
    } finally {
      this.loading.set(false);
    }
  }

  private fetchPage(pageIndex: number) {
    const filter = this.activeFilter();
    return this.interventionService.list({
      page: pageIndex,
      size: PAGE_SIZE,
      sort: 'scheduledAt,desc',
      status: filter === 'ALL' ? undefined : filter,
    });
  }
}
