import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

export interface TimelineActivity {
  id: string;
  type: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'forwarded' | 'updated' | 'comment';
  title: string;
  description?: string;
  user?: string;
  timestamp: Date;
  metadata?: any;
}

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-timeline.html',
  styleUrl: './activity-timeline.scss'
})
export class ActivityTimelineComponent {
  @Input() activities: TimelineActivity[] = [];
  @Input() title: string = 'Recent Activity';
  @Input() maxItems: number = 10;

  get displayActivities(): TimelineActivity[] {
    return this.activities.slice(0, this.maxItems);
  }

  getTimeAgo(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      submitted: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      reviewed: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      rejected: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      forwarded: 'M13 7l5 5m0 0l-5 5m5-5H6',
      updated: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      comment: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
    };
    return icons[type] || icons['updated'];
  }

  getColorForType(type: string): string {
    const colors: { [key: string]: string } = {
      submitted: 'blue',
      reviewed: 'purple',
      approved: 'green',
      rejected: 'red',
      forwarded: 'orange',
      updated: 'gray',
      comment: 'teal'
    };
    return colors[type] || 'gray';
  }
}
