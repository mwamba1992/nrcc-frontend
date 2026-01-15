import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { NotificationCenterComponent, Notification } from '../notification-center/notification-center';
import { GlobalSearchComponent } from '../global-search/global-search';
import { BreadcrumbsComponent, Breadcrumb } from '../breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-reviewer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationCenterComponent, GlobalSearchComponent, BreadcrumbsComponent],
  templateUrl: './reviewer-layout.html',
  styleUrl: './reviewer-layout.scss'
})
export class ReviewerLayoutComponent {
  currentUser: User | null = null;
  reviewerLevel: string = '';
  notifications: Notification[] = [];
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Reviewer Portal', url: '/reviewer' },
    { label: 'Dashboard' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser();
    this.setReviewerLevel();
    this.loadNotifications();
  }

  setReviewerLevel(): void {
    switch (this.currentUser?.role) {
      case UserRole.DISTRICT_REVIEWER:
        this.reviewerLevel = 'District Level';
        break;
      case UserRole.REGIONAL_REVIEWER:
        this.reviewerLevel = 'Regional Level';
        break;
      case UserRole.NATIONAL_REVIEWER:
        this.reviewerLevel = 'National Level';
        break;
      case UserRole.NRCC_MEMBER:
        this.reviewerLevel = 'NRCC Committee';
        break;
      case UserRole.ADMIN:
        this.reviewerLevel = 'System Administrator';
        break;
      default:
        this.reviewerLevel = 'Reviewer';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/reviewer/dashboard']);
  }

  navigateToQueue(): void {
    this.router.navigate(['/reviewer/applications-queue']);
  }

  loadNotifications(): void {
    // Mock notifications - replace with actual API call
    this.notifications = [
      {
        id: '1',
        type: 'info',
        title: 'New Application Submitted',
        message: 'Application #RF-2024-005 has been submitted for review',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false
      },
      {
        id: '2',
        type: 'success',
        title: 'Application Approved',
        message: 'Your review for #RF-2024-003 has been approved',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'Review Deadline Approaching',
        message: 'Application #RF-2024-002 requires review within 24 hours',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true
      }
    ];
  }

  onNotificationClick(notification: Notification): void {
    console.log('Notification clicked:', notification);
    // Navigate to relevant page or show details
  }

  onMarkAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  onClearAllNotifications(): void {
    this.notifications = [];
  }

  onSearch(query: string): void {
    console.log('Search query:', query);
    // Implement search functionality
    this.router.navigate(['/reviewer/search'], { queryParams: { q: query } });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }
}
