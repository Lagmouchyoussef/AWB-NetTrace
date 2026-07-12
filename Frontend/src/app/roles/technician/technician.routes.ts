import { Routes } from '@angular/router';
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
        loadComponent: () =>
          import('./pages/my-interventions/my-interventions.component').then(
            (m) => m.TechnicianMyInterventionsComponent,
          ),
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
        loadComponent: () =>
          import('./pages/schedule/schedule.component').then((m) => m.TechnicianScheduleComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.component').then(
            (m) => m.TechnicianNotificationsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.TechnicianProfileComponent),
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./pages/notes/notes.component').then((m) => m.TechnicianNotesComponent),
      },
    ],
  },
];
