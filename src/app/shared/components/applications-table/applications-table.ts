import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Application {
  id: string;
  projectName: string;
  district: string;
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'forwarded';
  urgencyLevel: 'overdue' | 'due-soon' | 'on-track';
  slaDeadline: Date;
  slaDaysRemaining: number;
}

@Component({
  selector: 'app-applications-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications-table.html',
  styleUrl: './applications-table.scss'
})
export class ApplicationsTableComponent {
  @Input() applications: Application[] = [];
  @Input() isLoading: boolean = false;
  @Output() viewApplication = new EventEmitter<string>();
  @Output() reviewApplication = new EventEmitter<string>();

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'PENDING',
      'reviewed': 'REVIEWED',
      'approved': 'APPROVED',
      'rejected': 'REJECTED',
      'forwarded': 'FORWARDED'
    };
    return labels[status] || status.toUpperCase();
  }

  getUrgencyLabel(urgency: string): string {
    const labels: { [key: string]: string } = {
      'overdue': 'OVERDUE',
      'due-soon': 'DUE SOON',
      'on-track': 'ON TRACK'
    };
    return labels[urgency] || urgency.toUpperCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  onView(applicationId: string): void {
    this.viewApplication.emit(applicationId);
  }

  onReview(applicationId: string): void {
    this.reviewApplication.emit(applicationId);
  }
}
