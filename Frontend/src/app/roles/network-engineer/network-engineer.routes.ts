import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { NETWORK_ENGINEER_NAV } from './network-engineer-nav.config';
import { NetworkEngineerShellComponent } from './network-engineer-shell.component';

// Every leaf renders as a placeholder until its step is built (see the role's step-by-step
// delivery plan) - mirrors the exact REAL_PAGE_PATHS pattern used for super-admin/dc-admin.
const REAL_PAGE_PATHS = new Set<string>([]);

function toPlaceholderRoutes(section: NavSection): Routes {
  const leaves = section.children ?? (section.path === undefined ? [] : [section]);
  return leaves
    .filter((leaf) => leaf.path !== '' && !REAL_PAGE_PATHS.has(leaf.path ?? ''))
    .map((leaf) => ({
      path: leaf.path,
      component: PlaceholderPageComponent,
      data: {
        titleKey: leaf.labelKey,
        sectionKey: section.children ? section.labelKey : undefined,
      },
    }));
}

const placeholderRoutes: Routes = NETWORK_ENGINEER_NAV.flatMap(toPlaceholderRoutes);

export const networkEngineerRoutes: Routes = [
  {
    path: '',
    component: NetworkEngineerShellComponent,
    children: [
      {
        path: '',
        component: PlaceholderPageComponent,
        data: { titleKey: 'nav.dashboard' },
      },
      ...placeholderRoutes,
    ],
  },
];
