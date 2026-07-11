import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationService } from '../../../../core/services/notification.service';

// Full-page view of the same live SSE-backed feed the topbar bell dropdown already shows
// app-wide - large rows and a prominent unread indicator here instead of a small dropdown,
// per the field-use brief. No dedicated technician-specific notification model exists (or is
// needed): this role just needs a bigger, clearer window onto the same stream.
@Component({
  selector: 'app-technician-notifications',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class TechnicianNotificationsComponent {
  private readonly notificationService = inject(NotificationService);

  protected readonly notifications = toSignal(this.notificationService.getNotifications(), {
    initialValue: [],
  });

  protected onMarkAllRead(): void {
    this.notificationService.markAllRead();
  }

  protected onDismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
