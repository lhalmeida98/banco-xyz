import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../../core/models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();
  private notifications: Notification[] = [];
  private idCounter = 0;

  showNotification(title: string, message: string, type: 'success' | 'warning' | 'error') {
    const notification: Notification = { message, type, title, id: this.idCounter++ };
    this.notifications.push(notification);
    this.notificationSubject.next(notification);

    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  getNotifications() {
    return this.notifications;
  }

  private removeNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

}
