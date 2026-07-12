import { Routes } from '@angular/router';
import { ApproverShellComponent } from './approver-shell.component';

export const approverRoutes: Routes = [
  {
    path: '',
    component: ApproverShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/approver-dashboard.component').then((m) => m.ApproverDashboardComponent),
      },
      {
        path: 'approval-queue',
        loadComponent: () =>
          import('./pages/approval-queue/approval-queue.component').then(
            (m) => m.ApproverApprovalQueueComponent,
          ),
      },
      {
        path: 'all-interventions',
        loadComponent: () =>
          import('./pages/all-interventions/all-interventions.component').then(
            (m) => m.ApproverAllInterventionsComponent,
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calendar/calendar.component').then((m) => m.ApproverCalendarComponent),
      },
      {
        path: 'decision-history',
        loadComponent: () =>
          import('./pages/decision-history/decision-history.component').then(
            (m) => m.ApproverDecisionHistoryComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then((m) => m.ApproverReportsComponent),
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./pages/my-requests/my-requests.component').then(
            (m) => m.ApproverMyRequestsComponent,
          ),
      },
    ],
  },
];
