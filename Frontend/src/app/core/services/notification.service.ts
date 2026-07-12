import { Injectable, effect, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { DashboardService } from './dashboard.service';
import { DcAdminDashboardService } from './dc-admin-dashboard.service';
import { ApproverDashboardService } from './approver-dashboard.service';

export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationEventPayload {
  actorUsername: string;
  action: string;
  entityType: string;
  description: string | null;
  occurredAt: string;
}

const MAX_NOTIFICATIONS = 20;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);
  private readonly dashboardService = inject(DashboardService);
  private readonly dcAdminDashboardService = inject(DcAdminDashboardService);
  private readonly approverDashboardService = inject(ApproverDashboardService);

  private eventSource: EventSource | null = null;
  private readonly notifications$ = new BehaviorSubject<AppNotification[]>([]);

  constructor() {
    // Reconnects the SSE stream whenever the signed-in role changes (login/logout/switch role).
    effect(() => {
      const role = this.authService.currentRole();
      this.eventSource?.close();
      this.eventSource = null;

      if (!role) {
        this.notifications$.next([]);
        return;
      }

      const token = this.authService.getToken();
      this.eventSource = new EventSource(
        `${environment.apiBaseUrl}/api/notifications/stream?token=${encodeURIComponent(token ?? '')}`,
      );
      this.eventSource.addEventListener('notification', (event) => {
        const payload = JSON.parse(
          (event as MessageEvent<string>).data,
        ) as NotificationEventPayload;
        const notification = this.toAppNotification(payload);
        this.notifications$.next(
          [notification, ...this.notifications$.value].slice(0, MAX_NOTIFICATIONS),
        );
        // Only refresh the dashboard matching the signed-in role - the other role's endpoint
        // would 403 for this user's token.
        const role = this.authService.currentRole();
        if (role === 'DC_ADMIN') {
          this.dcAdminDashboardService.triggerRefresh();
        } else if (role === 'APPROVER') {
          this.approverDashboardService.triggerRefresh();
        } else {
          this.dashboardService.triggerRefresh();
        }
      });
    });
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.notifications$.asObservable();
  }

  markAllRead(): void {
    this.notifications$.next(this.notifications$.value.map((n) => ({ ...n, read: true })));
  }

  dismiss(id: string): void {
    this.notifications$.next(this.notifications$.value.filter((n) => n.id !== id));
  }

  clearAll(): void {
    this.notifications$.next([]);
  }

  private toAppNotification(payload: NotificationEventPayload): AppNotification {
    const actionLabel = this.translateService.instant(
      `dashboard.activityActions.${payload.action}`,
    );
    const message = payload.description
      ? `${payload.actorUsername} ${actionLabel} ${payload.entityType} — ${payload.description}`
      : `${payload.actorUsername} ${actionLabel} ${payload.entityType}`;
    return {
      id: `${payload.occurredAt}-${payload.actorUsername}-${Math.random().toString(36).slice(2)}`,
      message,
      createdAt: payload.occurredAt,
      read: false,
    };
  }
}
