import { Routes } from '@angular/router';
import { RequesterShellComponent } from './requester-shell.component';

export const requesterRoutes: Routes = [
  {
    path: '',
    component: RequesterShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/requester-dashboard.component').then(
            (m) => m.RequesterDashboardComponent,
          ),
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./pages/my-requests/my-requests-list.component').then(
            (m) => m.RequesterMyRequestsListComponent,
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar.component').then((m) => m.RequesterCalendarComponent),
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./pages/devices/devices-list.component').then(
            (m) => m.RequesterDevicesListComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then((m) => m.RequesterReportsComponent),
      },
      {
        path: 'my-account',
        loadComponent: () =>
          import('./pages/my-account/my-account.component').then(
            (m) => m.RequesterMyAccountComponent,
          ),
      },
    ],
  },
];
