import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss'
})
export class NotificationCenterComponent {
  @Input() notifications: Notification[] = [];
  @Output() notificationClick = new EventEmitter<Notification>();
  @Output() markAsRead = new EventEmitter<string>();
  @Output() clearAll = new EventEmitter<void>();

  isOpen = false;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  closePanel(): void {
    this.isOpen = false;
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.markAsRead.emit(notification.id);
    }
    this.notificationClick.emit(notification);
    this.closePanel();
  }

  onClearAll(): void {
    this.clearAll.emit();
  }

  getTimeAgo(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[type] || icons['info'];
  }
}
