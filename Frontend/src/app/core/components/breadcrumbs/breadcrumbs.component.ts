import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);

  readonly roleLabelKey = input.required<string>();

  protected readonly crumbKeys = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildCrumbKeys()),
    ),
    { initialValue: [] as string[] },
  );

  private buildCrumbKeys(): string[] {
    let node = this.router.routerState.snapshot.root;
    let data: { titleKey?: string; sectionKey?: string } = {};
    while (node.firstChild) {
      node = node.firstChild;
      data = { ...data, ...node.data };
    }
    return [data.sectionKey, data.titleKey].filter((key): key is string => !!key);
  }
}
