import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../../core/models/Notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  public notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();


  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notifications = this.notificationService.getNotifications();
    this.subscription = this.notificationService.notification$.subscribe((notification) => {
      this.notifications.push(notification);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
