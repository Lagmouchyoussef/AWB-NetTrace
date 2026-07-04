import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // No backend notifications endpoint exists yet — honest empty state rather than mock data.
  // Swap this for a real HttpClient call once one exists.
  getNotifications(): Observable<AppNotification[]> {
    return of([]);
  }
}
