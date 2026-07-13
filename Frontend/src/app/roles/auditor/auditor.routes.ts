import { Routes } from '@angular/router';
import { AuditorShellComponent } from './auditor-shell.component';

export const auditorRoutes: Routes = [
  {
    path: '',
    component: AuditorShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/auditor-dashboard.component').then(
            (m) => m.AuditorDashboardComponent,
          ),
      },
      {
        path: 'audit-log',
        loadComponent: () =>
          import('./pages/audit-log/audit-log-list.component').then(
            (m) => m.AuditorAuditLogListComponent,
          ),
      },
      {
        path: 'interventions',
        loadComponent: () =>
          import('./pages/interventions/interventions-list.component').then(
            (m) => m.AuditorInterventionsListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users-list.component').then((m) => m.AuditorUsersListComponent),
      },
      {
        path: 'role-permissions',
        loadComponent: () =>
          import('./pages/role-permissions/role-permissions-list.component').then(
            (m) => m.AuditorRolePermissionsListComponent,
          ),
      },
      {
        path: 'system-settings',
        loadComponent: () =>
          import('./pages/system-settings/system-settings-list.component').then(
            (m) => m.AuditorSystemSettingsListComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-list.component').then(
            (m) => m.AuditorReportsListComponent,
          ),
      },
      {
        path: 'my-account',
        loadComponent: () =>
          import('./pages/my-account/my-account.component').then(
            (m) => m.AuditorMyAccountComponent,
          ),
      },
    ],
  },
];
