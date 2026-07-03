import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'super-admin',
    canActivate: [authGuard, roleGuard('SUPER_ADMIN')],
    loadChildren: () =>
      import('./roles/super-admin/super-admin.routes').then((m) => m.superAdminRoutes),
  },
  {
    path: 'dc-admin',
    canActivate: [authGuard, roleGuard('DC_ADMIN')],
    loadChildren: () => import('./roles/dc-admin/dc-admin.routes').then((m) => m.dcAdminRoutes),
  },
  {
    path: 'network-engineer',
    canActivate: [authGuard, roleGuard('NETWORK_ENGINEER')],
    loadChildren: () =>
      import('./roles/network-engineer/network-engineer.routes').then(
        (m) => m.networkEngineerRoutes,
      ),
  },
  {
    path: 'technician',
    canActivate: [authGuard, roleGuard('TECHNICIAN')],
    loadChildren: () =>
      import('./roles/technician/technician.routes').then((m) => m.technicianRoutes),
  },
  {
    path: 'approver',
    canActivate: [authGuard, roleGuard('APPROVER')],
    loadChildren: () => import('./roles/approver/approver.routes').then((m) => m.approverRoutes),
  },
  {
    path: 'requester',
    canActivate: [authGuard, roleGuard('REQUESTER')],
    loadChildren: () => import('./roles/requester/requester.routes').then((m) => m.requesterRoutes),
  },
  {
    path: 'auditor',
    canActivate: [authGuard, roleGuard('AUDITOR')],
    loadChildren: () => import('./roles/auditor/auditor.routes').then((m) => m.auditorRoutes),
  },
];
