import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SlaStatus = 'overdue' | 'due-soon' | 'on-track' | 'completed';

export interface SlaInfo {
  status: SlaStatus;
  daysRemaining?: number;
  dueDate?: Date;
  completedDate?: Date;
}

@Component({
  selector: 'app-sla-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sla-badge.html',
  styleUrl: './sla-badge.scss',
})
export class SlaBadgeComponent {
  @Input() slaInfo!: SlaInfo;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcon: boolean = true;
  @Input() showLabel: boolean = true;

  getStatusLabel(): string {
    switch (this.slaInfo.status) {
      case 'overdue':
        return `Overdue ${this.getDaysText()}`;
      case 'due-soon':
        return `Due ${this.getDaysText()}`;
      case 'on-track':
        return `${this.getDaysText()} remaining`;
      case 'completed':
        return 'Completed on time';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(): string {
    return `sla-badge-${this.slaInfo.status}`;
  }

  getSizeClass(): string {
    return `sla-badge-${this.size}`;
  }

  getDaysText(): string {
    if (this.slaInfo.daysRemaining === undefined) {
      return '';
    }

    const days = Math.abs(this.slaInfo.daysRemaining);
    if (days === 0) {
      return 'today';
    } else if (days === 1) {
      return '1 day';
    } else {
      return `${days} days`;
    }
  }

  getIconSvg(): string {
    const icons: Record<SlaStatus, string> = {
      overdue: `<circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>`,
      'due-soon': `<circle cx="12" cy="12" r="10"/>
                   <polyline points="12 6 12 12 16 14"/>`,
      'on-track': `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                   <polyline points="22 4 12 14.01 9 11.01"/>`,
      completed: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>`,
    };
    return icons[this.slaInfo.status];
  }

  getAriaLabel(): string {
    const baseLabel = `SLA Status: ${this.slaInfo.status}`;
    if (this.slaInfo.daysRemaining !== undefined) {
      return `${baseLabel}. ${this.getStatusLabel()}`;
    }
    return baseLabel;
  }
}
