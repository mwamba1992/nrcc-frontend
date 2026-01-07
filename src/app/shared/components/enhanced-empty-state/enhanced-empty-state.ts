import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EmptyStateAction {
  label: string;
  icon?: string;
  handler: () => void;
  primary?: boolean;
}

@Component({
  selector: 'app-enhanced-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enhanced-empty-state.html',
  styleUrl: './enhanced-empty-state.scss',
})
export class EnhancedEmptyStateComponent {
  @Input() title: string = 'No Records Found';
  @Input() message: string = 'There are currently no items to display.';
  @Input() guidance?: string;
  @Input() icon?: string = 'inbox';
  @Input() actions?: EmptyStateAction[];
  @Input() showLastRefresh: boolean = true;
  @Input() showNotificationSetup: boolean = false;

  @Output() refresh = new EventEmitter<void>();
  @Output() setupNotifications = new EventEmitter<void>();

  lastRefreshTime: string = new Date().toLocaleString('en-TZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  onRefresh(): void {
    this.lastRefreshTime = new Date().toLocaleString('en-TZ', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    this.refresh.emit();
  }

  onSetupNotifications(): void {
    this.setupNotifications.emit();
  }

  executeAction(action: EmptyStateAction): void {
    action.handler();
  }

  getIconSvg(): string {
    const icons: Record<string, string> = {
      inbox: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>`,
      search: `<circle cx="11" cy="11" r="8"/>
               <path d="m21 21-4.35-4.35"/>`,
      clipboard: `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>`,
      alert: `<circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>`,
    };
    return icons[this.icon || 'inbox'] || icons['inbox'];
  }
}
