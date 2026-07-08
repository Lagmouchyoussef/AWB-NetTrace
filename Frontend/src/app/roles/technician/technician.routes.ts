import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from '../../core/components/placeholder-page/placeholder-page.component';
import { TechnicianShellComponent } from './technician-shell.component';

export const technicianRoutes: Routes = [
  {
    path: '',
    component: TechnicianShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.TechnicianHomeComponent),
      },
      {
        path: 'my-interventions',
        component: PlaceholderPageComponent,
        data: { titleKey: 'technician.nav.myInterventions' },
      },
      {
        path: 'interventions/:id',
        loadComponent: () =>
          import('./pages/intervention-detail/intervention-detail.component').then(
            (m) => m.TechnicianInterventionDetailComponent,
          ),
      },
      {
        path: 'schedule',
        component: PlaceholderPageComponent,
        data: { titleKey: 'technician.nav.schedule' },
      },
      {
        path: 'notifications',
        component: PlaceholderPageComponent,
        data: { titleKey: 'technician.nav.notifications' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.TechnicianProfileComponent),
      },
    ],
  },
];
