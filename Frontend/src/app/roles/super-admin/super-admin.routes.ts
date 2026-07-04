import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { NavSection } from '../../core/types/nav';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard.component';
import { SUPER_ADMIN_NAV } from './super-admin-nav.config';
import { SuperAdminShellComponent } from './super-admin-shell.component';

function toPlaceholderRoutes(section: NavSection): Routes {
  const leaves = section.children ?? (section.path === undefined ? [] : [section]);
  return leaves
    .filter((leaf) => leaf.path !== '')
    .map((leaf) => ({
      path: leaf.path,
      component: PlaceholderPageComponent,
      data: {
        titleKey: leaf.labelKey,
        sectionKey: section.children ? section.labelKey : undefined,
      },
    }));
}

const placeholderRoutes: Routes = SUPER_ADMIN_NAV.flatMap(toPlaceholderRoutes);

export const superAdminRoutes: Routes = [
  {
    path: '',
    component: SuperAdminShellComponent,
    children: [
      { path: '', component: SuperAdminDashboardComponent, data: { titleKey: 'nav.dashboard' } },
      ...placeholderRoutes,
    ],
  },
];
