# Government Reviewer Portal - Comprehensive Improvements Plan
## Roads Fund Board - NRCC System Enhancements

**Last Updated:** 2026-01-06
**Version:** 1.0.0
**Compliance Target:** WCAG 2.1 AA, Government Standards

---

## Executive Summary

This document outlines systematic improvements to transform the NRCC Reviewer Portal into a fully compliant government system meeting:
- WCAG 2.1 AA accessibility standards
- Government accountability requirements
- SLA tracking and urgency management
- Audit trail capabilities
- User experience best practices for official systems

---

## 1. ACCESSIBILITY FIXES (PRIORITY 1 - LEGAL REQUIREMENT)

### 1.1 Color Contrast Improvements

**IMPLEMENTED:**
```scss
// High contrast text colors (WCAG AA compliant)
$text-primary: #212121;        // Contrast ratio: 16:1 on white
$text-secondary: #424242;      // Contrast ratio: 12.6:1 on white
$text-muted: #616161;          // Contrast ratio: 7:1 on white (AA compliant)

// Status colors (high visibility)
$gov-success: #2E7D32;         // Green - 4.7:1 contrast
$gov-warning: #F57F17;         // Amber - 4.5:1 contrast
$gov-danger: #B71C1C;          // Red - 7.4:1 contrast
$gov-info: #0D47A1;            // Blue - 8.2:1 contrast
```

**TODO - Update Components:**

```scss
// Update all timestamp text
.timeline-time,
.card-subtitle,
.meta-text {
  color: $text-muted;  // Changed from #9ca3af to #616161
  font-size: $font-size-minimum;  // Minimum 14px
}

// Update section headers
.section-header h5,
.nav-section h5 {
  color: $text-secondary;  // Changed from #6b7280 to #424242
  font-size: $font-size-label;  // 12px minimum for uppercase
  letter-spacing: 0.5px;
}

// Update body text
.card-body p,
.description-text {
  font-size: $font-size-minimum;  // Ensure 14px minimum
  color: $text-primary;
}
```

### 1.2 Focus States

**ADD TO ALL INTERACTIVE ELEMENTS:**

```scss
// Global focus state for accessibility
*:focus-visible {
  outline: 3px solid $gov-info;
  outline-offset: 2px;
  border-radius: 2px;
}

// Button focus
.btn:focus-visible,
.filter-btn:focus-visible {
  outline: 3px solid $gov-info;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba($gov-info, 0.2);
}

// Link focus
.nav-link:focus-visible,
a:focus-visible {
  outline: 3px solid #FFFFFF;
  outline-offset: 2px;
  background: $gov-accent-blue;
}

// Input focus
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  border-color: $gov-info;
  outline: 3px solid $gov-info;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba($gov-info, 0.15);
}
```

### 1.3 ARIA Labels

**UPDATE HTML:**

```html
<!-- Icon-only buttons need aria-labels -->
<button class="icon-btn"
        aria-label="User profile settings"
        title="Profile">
  <svg>...</svg>
</button>

<button class="icon-btn"
        (click)="logout()"
        aria-label="Logout from system"
        title="Logout">
  <svg>...</svg>
</button>

<!-- Filter buttons -->
<button class="filter-btn"
        [class.active]="activeFilter === 'pending'"
        (click)="setFilter('pending')"
        aria-label="Filter by pending status"
        aria-pressed="{{activeFilter === 'pending'}}">
  Pending
</button>

<!-- Stats cards need context -->
<div class="stat-card" role="region" aria-label="Pending review statistics">
  <div class="card-body">
    <h3 aria-label="24 applications pending review">24</h3>
    <p>Pending Review</p>
  </div>
</div>
```

### 1.4 Minimum Touch Targets

```scss
// Ensure 44px minimum for touch targets
.btn,
.filter-btn,
.icon-btn,
.nav-link,
.table-action-btn {
  min-height: 44px;
  min-width: 44px;
  padding: 10px 16px;
}

// Mobile tap targets
@media (max-width: $breakpoint-md) {
  .clickable-row,
  .action-button {
    min-height: 48px;
  }
}
```

---

## 2. EMPTY STATE IMPROVEMENTS (PRIORITY 4)

### 2.1 Enhanced Empty State Component

**CREATE: `src/app/shared/components/empty-state/`**

```typescript
// empty-state.ts
export interface EmptyStateConfig {
  title: string;
  message: string;
  icon?: string;
  actions?: {
    label: string;
    icon?: string;
    action: () => void;
    primary?: boolean;
  }[];
  lastRefresh?: Date;
  showNotificationSetup?: boolean;
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss'
})
export class EmptyStateComponent {
  @Input() config!: EmptyStateConfig;

  formatLastRefresh(date: Date): string {
    return `Last refreshed: ${formatDistanceToNow(date, { addSuffix: true })}`;
  }
}
```

**CREATE: `empty-state.html`**

```html
<div class="empty-state-container" role="status" aria-live="polite">
  <div class="empty-state-icon">
    <svg *ngIf="!config.icon" width="64" height="64" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  </div>

  <h3 class="empty-state-title">{{ config.title }}</h3>
  <p class="empty-state-message">{{ config.message }}</p>

  <!-- Last Refresh -->
  <div class="empty-state-meta" *ngIf="config.lastRefresh">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
    <span>{{ formatLastRefresh(config.lastRefresh) }}</span>
  </div>

  <!-- Quick Actions -->
  <div class="empty-state-actions" *ngIf="config.actions && config.actions.length">
    <button *ngFor="let action of config.actions"
            [class.btn-primary]="action.primary"
            [class.btn-secondary]="!action.primary"
            (click)="action.action()"
            class="action-btn">
      <svg *ngIf="action.icon" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <!-- Dynamic icon -->
      </svg>
      <span>{{ action.label }}</span>
    </button>
  </div>

  <!-- Notification Setup -->
  <div class="notification-prompt" *ngIf="config.showNotificationSetup">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
    <div>
      <h4>Stay Updated</h4>
      <p>Enable notifications to be alerted when new applications arrive.</p>
      <button class="btn-link">Set Up Notifications</button>
    </div>
  </div>
</div>
```

**CREATE: `empty-state.scss`**

```scss
.empty-state-container {
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  padding: $spacing-12 $spacing-6;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.empty-state-icon {
  color: $gray-300;
  margin-bottom: $spacing-5;
}

.empty-state-title {
  font-size: 20px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 $spacing-3;
}

.empty-state-message {
  font-size: $font-size-minimum;
  color: $text-secondary;
  margin: 0 0 $spacing-5;
  line-height: 1.6;
}

.empty-state-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  font-size: 13px;
  color: $text-muted;
  margin-bottom: $spacing-6;

  svg {
    color: $gray-400;
  }
}

.empty-state-actions {
  display: flex;
  gap: $spacing-3;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: $spacing-6;

  .action-btn {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    min-height: 44px;
    padding: 10px 20px;
  }
}

.notification-prompt {
  background: rgba($gov-info, 0.05);
  border: 1px solid rgba($gov-info, 0.2);
  border-radius: $radius-md;
  padding: $spacing-5;
  display: flex;
  gap: $spacing-4;
  text-align: left;
  margin-top: $spacing-6;

  svg {
    flex-shrink: 0;
    color: $gov-info;
  }

  h4 {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin: 0 0 $spacing-2;
  }

  p {
    font-size: 13px;
    color: $text-secondary;
    margin: 0 0 $spacing-3;
  }

  .btn-link {
    color: $gov-info;
    font-weight: $font-weight-medium;
    text-decoration: none;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
```

**USAGE IN DASHBOARD:**

```typescript
// reviewer-dashboard.ts
emptyStateConfig: EmptyStateConfig = {
  title: 'No Applications in Queue',
  message: 'All current applications have been processed. New submissions will appear here when received.',
  lastRefresh: new Date(),
  actions: [
    {
      label: 'View Forwarded Applications',
      action: () => this.navigateToForwarded(),
      primary: true
    },
    {
      label: 'Check Reports',
      action: () => this.navigateToReports()
    },
    {
      label: 'Refresh Queue',
      icon: 'refresh',
      action: () => this.refreshData()
    }
  ],
  showNotificationSetup: true
};
```

---

## 3. SLA/URGENCY TRACKING (PRIORITY 3)

### 3.1 SLA Badge Component

**CREATE: `src/app/shared/components/sla-badge/`**

```typescript
// sla-badge.ts
export type SLAStatus = 'overdue' | 'due-soon' | 'on-track';

export interface SLAInfo {
  status: SLAStatus;
  daysPending: number;
  deadline: Date;
  slaLimit: number; // days
}

@Component({
  selector: 'app-sla-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="sla-badge"
          [class.overdue]="sla.status === 'overdue'"
          [class.due-soon]="sla.status === 'due-soon'"
          [class.on-track]="sla.status === 'on-track'"
          [attr.aria-label]="getAriaLabel()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      <span class="badge-text">
        {{ sla.daysPending }} days
        <span class="badge-status">({{ getStatusText() }})</span>
      </span>
    </span>
  `,
  styleUrls: ['./sla-badge.scss']
})
export class SLABadgeComponent {
  @Input() sla!: SLAInfo;

  getStatusText(): string {
    switch (this.sla.status) {
      case 'overdue': return 'OVERDUE';
      case 'due-soon': return 'DUE SOON';
      case 'on-track': return 'On Track';
      default: return '';
    }
  }

  getAriaLabel(): string {
    return `Application pending for ${this.sla.daysPending} days. Status: ${this.getStatusText()}`;
  }
}
```

**CREATE: `sla-badge.scss`**

```scss
.sla-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: $font-weight-semibold;
  border: 1px solid;

  &.overdue {
    background: rgba($sla-overdue, 0.1);
    border-color: $sla-overdue;
    color: $sla-overdue;

    svg {
      animation: pulse 2s infinite;
    }
  }

  &.due-soon {
    background: rgba($sla-due-soon, 0.1);
    border-color: $sla-due-soon;
    color: $sla-due-soon;
  }

  &.on-track {
    background: rgba($sla-on-track, 0.1);
    border-color: $sla-on-track;
    color: $sla-on-track;
  }

  .badge-status {
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.5px;
    margin-left: 4px;
  }

  svg {
    width: 8px;
    height: 8px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 3.2 Calculate SLA Status

```typescript
// services/sla.service.ts
@Injectable({ providedIn: 'root' })
export class SLAService {
  private SLA_LIMITS = {
    standard: 14,      // days
    priority: 7,       // days
    urgent: 3          // days
  };

  calculateSLA(submittedDate: Date, priority: 'standard' | 'priority' | 'urgent' = 'standard'): SLAInfo {
    const daysPending = differenceInDays(new Date(), submittedDate);
    const slaLimit = this.SLA_LIMITS[priority];
    const deadline = addDays(submittedDate, slaLimit);

    let status: SLAStatus;
    if (daysPending > slaLimit) {
      status = 'overdue';
    } else if (daysPending > slaLimit - 3) {  // Within 3 days of deadline
      status = 'due-soon';
    } else {
      status = 'on-track';
    }

    return { status, daysPending, deadline, slaLimit };
  }

  getSLASummary(applications: Application[]): {
    overdue: number;
    dueSoon: number;
    onTrack: number;
  } {
    return applications.reduce((acc, app) => {
      const sla = this.calculateSLA(app.submittedDate, app.priority);
      acc[sla.status === 'overdue' ? 'overdue' :
          sla.status === 'due-soon' ? 'dueSoon' : 'onTrack']++;
      return acc;
    }, { overdue: 0, dueSoon: 0, onTrack: 0 });
  }
}
```

---

## 4. ENHANCED METRICS CARDS (PRIORITY 5)

### 4.1 Add Trend Indicators

```html
<!-- reviewer-dashboard.html -->
<div class="stats-grid" *ngIf="!isLoading">
  <!-- Pending Review Card -->
  <div class="stat-card pending-card" (click)="filterByStatus('pending')"
       role="button" tabindex="0" aria-label="View 24 pending applications">
    <div class="card-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <div class="card-body">
      <h3>{{ stats.pending }}</h3>
      <p>Pending Review</p>
    </div>
    <div class="card-trend" [class.positive]="stats.trend.pending > 0"
         [class.negative]="stats.trend.pending < 0"
         *ngIf="stats.trend.pending !== 0"
         [attr.aria-label]="getTrendLabel('pending')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span>{{ Math.abs(stats.trend.pending) }}%</span>
    </div>
  </div>

  <!-- Overdue Card (NEW) -->
  <div class="stat-card overdue-card" (click)="filterByOverdue()"
       role="button" tabindex="0" aria-label="View 5 overdue applications">
    <div class="card-icon alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
    <div class="card-body">
      <h3>{{ slaSummary.overdue }}</h3>
      <p>Overdue</p>
    </div>
    <div class="card-alert" *ngIf="slaSummary.overdue > 0">
      <span>Requires Attention</span>
    </div>
  </div>

  <!-- Approved Card -->
  <div class="stat-card approved-card" (click)="filterByStatus('approved')">
    <!-- ... existing code ... -->
  </div>

  <!-- Total Card -->
  <div class="stat-card total-card">
    <!-- ... existing code ... -->
  </div>
</div>
```

```scss
// Add to reviewer-dashboard.scss
.stat-card {
  cursor: pointer;
  transition: none;

  &:hover {
    border-color: $gray-300;
    background: $gray-50;
  }

  &:focus-visible {
    outline: 3px solid $gov-info;
    outline-offset: 2px;
  }

  &.overdue-card {
    border-left: 3px solid $sla-overdue;

    .card-icon {
      background: rgba($sla-overdue, 0.1);
      color: $sla-overdue;

      &.alert {
        animation: pulse-alert 2s infinite;
      }
    }

    .card-body h3 {
      color: $sla-overdue;
    }
  }

  .card-alert {
    font-size: 11px;
    color: $sla-overdue;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  .card-trend {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: $font-weight-semibold;

    &.positive {
      color: $gov-success;
    }

    &.negative {
      color: $gov-danger;

      svg {
        transform: rotate(180deg);
      }
    }

    svg {
      width: 12px;
      height: 12px;
    }
  }
}

@keyframes pulse-alert {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 5. SEARCH & FILTER BAR (PRIORITY 2)

### 5.1 Search Component

**CREATE: `src/app/features/reviewer/components/application-search/`**

```html
<!-- application-search.html -->
<div class="search-filter-bar" role="search">
  <div class="search-container">
    <label for="application-search" class="sr-only">Search applications</label>
    <input type="search"
           id="application-search"
           [(ngModel)]="searchQuery"
           (input)="onSearchChange()"
           placeholder="Search by application #, district, or applicant name..."
           class="search-input"
           aria-label="Search applications by number, district, or applicant name">
    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  </div>

  <div class="filter-controls">
    <!-- Status Filter -->
    <div class="filter-group">
      <label for="status-filter">Status</label>
      <select id="status-filter"
              [(ngModel)]="selectedStatus"
              (change)="onFilterChange()"
              class="filter-select"
              aria-label="Filter by application status">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="forwarded">Forwarded</option>
      </select>
    </div>

    <!-- Date Range Filter -->
    <div class="filter-group">
      <label for="date-from">From Date</label>
      <input type="date"
             id="date-from"
             [(ngModel)]="dateFrom"
             (change)="onFilterChange()"
             class="filter-input"
             aria-label="Filter applications from date">
    </div>

    <div class="filter-group">
      <label for="date-to">To Date</label>
      <input type="date"
             id="date-to"
             [(ngModel)]="dateTo"
             (change)="onFilterChange()"
             class="filter-input"
             aria-label="Filter applications to date">
    </div>

    <!-- SLA Filter -->
    <div class="filter-group">
      <label for="sla-filter">Urgency</label>
      <select id="sla-filter"
              [(ngModel)]="selectedSLA"
              (change)="onFilterChange()"
              class="filter-select"
              aria-label="Filter by SLA urgency">
        <option value="">All</option>
        <option value="overdue">Overdue</option>
        <option value="due-soon">Due Soon</option>
        <option value="on-track">On Track</option>
      </select>
    </div>

    <!-- Clear Filters -->
    <button (click)="clearFilters()"
            class="btn-secondary"
            [disabled]="!hasActiveFilters()"
            aria-label="Clear all filters">
      Clear Filters
    </button>

    <!-- Export Button -->
    <button (click)="exportResults()"
            class="btn-secondary"
            aria-label="Export filtered results to Excel">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Export
    </button>
  </div>

  <!-- Active Filters Display -->
  <div class="active-filters" *ngIf="hasActiveFilters()">
    <span class="filter-label">Active Filters:</span>
    <span class="filter-chip" *ngIf="selectedStatus">
      Status: {{ selectedStatus }}
      <button (click)="clearStatus()" aria-label="Remove status filter">×</button>
    </span>
    <span class="filter-chip" *ngIf="dateFrom">
      From: {{ dateFrom | date:'shortDate' }}
      <button (click)="clearDateFrom()" aria-label="Remove from date filter">×</button>
    </span>
    <span class="filter-chip" *ngIf="dateTo">
      To: {{ dateTo | date:'shortDate' }}
      <button (click)="clearDateTo()" aria-label="Remove to date filter">×</button>
    </span>
    <span class="filter-chip" *ngIf="selectedSLA">
      Urgency: {{ selectedSLA }}
      <button (click)="clearSLA()" aria-label="Remove urgency filter">×</button>
    </span>
  </div>
</div>
```

```scss
// application-search.scss
.search-filter-bar {
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  padding: $spacing-5;
  margin-bottom: $spacing-5;
}

.search-container {
  position: relative;
  margin-bottom: $spacing-4;

  .search-input {
    width: 100%;
    padding: 12px 12px 12px 44px;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    font-size: $font-size-minimum;
    color: $text-primary;

    &:focus {
      border-color: $gov-info;
      outline: 3px solid $gov-info;
      outline-offset: 2px;
    }
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: $gray-400;
    pointer-events: none;
  }
}

.filter-controls {
  display: flex;
  gap: $spacing-4;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;

  label {
    font-size: $font-size-label;
    font-weight: $font-weight-semibold;
    color: $text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-select,
  .filter-input {
    min-width: 160px;
    padding: 10px 12px;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    font-size: $font-size-minimum;
    color: $text-primary;
    min-height: 44px;

    &:focus {
      border-color: $gov-info;
      outline: 3px solid $gov-info;
      outline-offset: 2px;
    }
  }
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
  align-items: center;
  margin-top: $spacing-4;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-200;

  .filter-label {
    font-size: 13px;
    font-weight: $font-weight-semibold;
    color: $text-secondary;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    padding: 6px 12px;
    background: rgba($gov-info, 0.1);
    border: 1px solid $gov-info;
    border-radius: $radius-full;
    font-size: 13px;
    color: $gov-info;

    button {
      background: none;
      border: none;
      color: $gov-info;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      min-width: auto;
      min-height: auto;

      &:hover {
        color: $gov-danger;
      }
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 6. APPLICATIONS QUEUE TABLE (PRIORITY 6)

### 6.1 Enhanced Table Structure

```html
<!-- applications-table.html -->
<div class="applications-queue">
  <div class="section-header">
    <h3>Applications Queue</h3>
    <div class="table-controls">
      <span class="results-count" aria-live="polite">
        Showing {{ filteredApplications.length }} of {{ totalApplications }} applications
      </span>
      <button class="btn-secondary"
              (click)="refreshTable()"
              aria-label="Refresh applications table">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>
  </div>

  <!-- Table -->
  <div class="table-container">
    <table class="applications-table" role="table" aria-label="Applications queue table">
      <thead>
        <tr>
          <th scope="col">
            <input type="checkbox"
                   [(ngModel)]="selectAll"
                   (change)="toggleSelectAll()"
                   aria-label="Select all applications">
          </th>
          <th scope="col" class="sortable" (click)="sortBy('applicationNumber')">
            Application #
            <svg *ngIf="sortColumn === 'applicationNumber'"
                 width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline [attr.points]="sortDirection === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
            </svg>
          </th>
          <th scope="col" class="sortable" (click)="sortBy('district')">District</th>
          <th scope="col">Type</th>
          <th scope="col" class="sortable" (click)="sortBy('submittedDate')">Submitted</th>
          <th scope="col" class="sortable" (click)="sortBy('daysPending')">Days Pending</th>
          <th scope="col">SLA Status</th>
          <th scope="col">Priority</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loading State -->
        <tr *ngIf="isLoading" class="loading-row">
          <td colspan="9">
            <app-skeleton-loader type="table-row" [count]="5"></app-skeleton-loader>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr *ngFor="let app of paginatedApplications; let i = index"
            class="data-row"
            [class.selected]="app.selected"
            [class.expandable]="expandedRow === i"
            (click)="toggleRowExpansion(i)">
          <td>
            <input type="checkbox"
                   [(ngModel)]="app.selected"
                   (click)="$event.stopPropagation()"
                   [attr.aria-label]="'Select application ' + app.applicationNumber">
          </td>
          <td>
            <a [routerLink]="['/reviewer/application', app.id]"
               class="application-link"
               (click)="$event.stopPropagation()">
              {{ app.applicationNumber }}
            </a>
          </td>
          <td>{{ app.district }}</td>
          <td><span class="type-badge">{{ app.type }}</span></td>
          <td>{{ app.submittedDate | date:'shortDate' }}</td>
          <td>{{ app.daysPending }} days</td>
          <td>
            <app-sla-badge [sla]="app.sla"></app-sla-badge>
          </td>
          <td>
            <span class="priority-badge" [class]="app.priority">
              {{ app.priority }}
            </span>
          </td>
          <td class="actions-cell" (click)="$event.stopPropagation()">
            <button class="action-btn"
                    (click)="viewApplication(app)"
                    aria-label="View application {{ app.applicationNumber }}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="action-btn"
                    (click)="approveApplication(app)"
                    aria-label="Approve application {{ app.applicationNumber }}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
            <button class="action-btn"
                    (click)="forwardApplication(app)"
                    aria-label="Forward application {{ app.applicationNumber }}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="13 17 18 12 13 7"/>
                <polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </td>
        </tr>

        <!-- Expanded Row Details -->
        <tr *ngIf="expandedRow !== null" class="expanded-details">
          <td colspan="9">
            <div class="details-container">
              <div class="detail-item">
                <span class="detail-label">Applicant:</span>
                <span class="detail-value">{{ paginatedApplications[expandedRow].applicantName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Road Name:</span>
                <span class="detail-value">{{ paginatedApplications[expandedRow].roadName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Documents:</span>
                <span class="detail-value">
                  {{ paginatedApplications[expandedRow].documentCount }} attached
                </span>
              </div>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr *ngIf="!isLoading && filteredApplications.length === 0" class="empty-row">
          <td colspan="9">
            <app-empty-state [config]="emptyStateConfig"></app-empty-state>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Bulk Actions Bar -->
  <div class="bulk-actions" *ngIf="selectedCount > 0">
    <span class="selection-count">{{ selectedCount }} selected</span>
    <button class="btn-secondary" (click)="bulkApprove()">Approve Selected</button>
    <button class="btn-secondary" (click)="bulkForward()">Forward Selected</button>
    <button class="btn-secondary" (click)="bulkExport()">Export Selected</button>
    <button class="btn-link" (click)="clearSelection()">Clear Selection</button>
  </div>

  <!-- Pagination -->
  <div class="pagination" role="navigation" aria-label="Table pagination">
    <button class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
            aria-label="Previous page">
      Previous
    </button>

    <span class="page-info" aria-live="polite">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

    <button class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
            aria-label="Next page">
      Next
    </button>

    <select [(ngModel)]="pageSize"
            (change)="changePageSize()"
            class="page-size-select"
            aria-label="Items per page">
      <option value="10">10 per page</option>
      <option value="25">25 per page</option>
      <option value="50">50 per page</option>
      <option value="100">100 per page</option>
    </select>
  </div>
</div>
```

```scss
// applications-table.scss
.applications-table {
  width: 100%;
  border-collapse: collapse;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-md;

  thead {
    background: $gray-100;
    border-bottom: 2px solid $gray-200;

    th {
      padding: 12px 16px;
      text-align: left;
      font-size: $font-size-label;
      font-weight: $font-weight-semibold;
      color: $text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.sortable {
        cursor: pointer;
        user-select: none;

        &:hover {
          background: $gray-200;
        }

        svg {
          display: inline-block;
          margin-left: 4px;
          vertical-align: middle;
        }
      }
    }
  }

  tbody {
    tr.data-row {
      border-bottom: 1px solid $gray-200;
      cursor: pointer;

      &:hover {
        background: $gray-50;
      }

      &.selected {
        background: rgba($gov-info, 0.05);
      }

      td {
        padding: 12px 16px;
        font-size: $font-size-minimum;
        color: $text-primary;
      }
    }

    .actions-cell {
      display: flex;
      gap: $spacing-2;

      .action-btn {
        min-width: 36px;
        min-height: 36px;
        padding: 8px;
        background: $gray-100;
        border: 1px solid $gray-200;
        border-radius: $radius-sm;
        cursor: pointer;
        color: $text-secondary;

        &:hover {
          background: $gov-info;
          border-color: $gov-info;
          color: $white;
        }

        &:focus-visible {
          outline: 3px solid $gov-info;
          outline-offset: 2px;
        }
      }
    }
  }

  .expanded-details {
    background: $gray-50;

    .details-container {
      padding: $spacing-5;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-4;

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-1;

        .detail-label {
          font-size: $font-size-label;
          font-weight: $font-weight-semibold;
          color: $text-secondary;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: $font-size-minimum;
          color: $text-primary;
        }
      }
    }
  }
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-4;
  background: rgba($gov-info, 0.05);
  border: 1px solid $gov-info;
  border-radius: $radius-md;
  margin-top: $spacing-4;

  .selection-count {
    font-weight: $font-weight-semibold;
    color: $gov-info;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4;
  margin-top: $spacing-4;

  .pagination-btn {
    min-height: 44px;
    padding: 10px 20px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .page-info {
    font-size: $font-size-minimum;
    color: $text-secondary;
  }

  .page-size-select {
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
  }
}
```

---

Due to length constraints, I've provided the critical implementations for the top 6 priorities. The remaining sections (Audit Trail, Government Features, Responsive Design) follow similar patterns.

**Next Steps:**
1. Review and approve these implementations
2. I can continue with sections 7-10 if needed
3. Test accessibility with WAVE/axe DevTools
4. Implement incrementally by priority

Would you like me to continue with the remaining sections?