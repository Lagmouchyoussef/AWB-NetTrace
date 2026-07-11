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
        path: 'anomaly-detections',
        loadComponent: () =>
          import('./pages/anomaly-detections/anomaly-detections-list.component').then(
            (m) => m.AuditorAnomalyDetectionsListComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-list.component').then(
            (m) => m.AuditorReportsListComponent,
          ),
      },
    ],
  },
];
