import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import {
  ApplicationResponse,
  ApplicationStatusLabels,
  ApplicationStatusColors,
  RoadClassLabels,
  ApplicantTypeLabels
} from '../../../core/models/application.model';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-applications-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './applications-queue.html',
  styleUrl: './applications-queue.scss'
})
export class ApplicationsQueueComponent implements OnInit {
  applications = signal<ApplicationResponse[]>([]);
  isLoading = signal(false);
  selectedFilter = signal<string>('all');
  searchTerm = signal<string>('');

  // Current user role
  currentUserRole = signal<string>('');

  // Status counts
  statusCounts = computed(() => {
    const apps = this.applications();
    return {
      total: apps.length,
      pending: apps.filter(a => this.isPendingForRole(a)).length,
      inProgress: apps.filter(a => this.isInProgressForRole(a)).length,
      completed: apps.filter(a => this.isCompletedStatus(a)).length
    };
  });

  // Filtered applications
  filteredApplications = computed(() => {
    let result = this.applications();
    const filter = this.selectedFilter();
    const search = this.searchTerm().toLowerCase();

    // Filter by status category
    if (filter === 'pending') {
      result = result.filter(a => this.isPendingForRole(a));
    } else if (filter === 'in_progress') {
      result = result.filter(a => this.isInProgressForRole(a));
    } else if (filter === 'completed') {
      result = result.filter(a => this.isCompletedStatus(a));
    }

    // Search filter
    if (search) {
      result = result.filter(a =>
        a.roadName.toLowerCase().includes(search) ||
        a.applicationNumber.toLowerCase().includes(search) ||
        a.applicantName.toLowerCase().includes(search)
      );
    }

    return result;
  });

  // Table configuration
  tableColumns: DataTableColumn<ApplicationResponse>[] = [
    {
      key: 'applicationNumber',
      label: 'Reference',
      sortable: true,
      width: '140px',
      class: 'reference-cell'
    },
    {
      key: 'roadName',
      label: 'Road Name',
      sortable: true
    },
    {
      key: 'applicantName',
      label: 'Applicant',
      sortable: true,
      width: '150px'
    },
    {
      key: 'applicantType',
      label: 'Type',
      sortable: true,
      width: '120px',
      format: (value) => ApplicantTypeLabels[value] || value
    },
    {
      key: 'currentClass',
      label: 'Current',
      sortable: true,
      width: '110px',
      format: (value) => RoadClassLabels[value] || value
    },
    {
      key: 'proposedClass',
      label: 'Proposed',
      sortable: true,
      width: '110px',
      format: (value) => RoadClassLabels[value] || value
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '180px',
      class: 'status-cell',
      format: (value) => ApplicationStatusLabels[value] || value
    },
    {
      key: 'submissionDate',
      label: 'Submitted',
      sortable: true,
      width: '110px',
      format: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  tableActions: DataTableAction<ApplicationResponse>[] = [
    {
      label: 'View Details',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z"/>',
      class: 'info',
      onClick: (row) => this.viewApplication(row)
    },
    {
      label: 'Forward',
      icon: '<path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>',
      class: 'primary',
      onClick: (row) => this.forwardApplication(row),
      visible: (row) => this.canForward(row)
    },
    {
      label: 'Approve',
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      class: 'success',
      onClick: (row) => this.approveApplication(row),
      visible: (row) => this.canApprove(row)
    },
    {
      label: 'Return',
      icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
      class: 'warning',
      onClick: (row) => this.returnForCorrection(row),
      visible: (row) => this.canReturn(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search by reference, road name, applicant...',
    emptyMessage: 'No applications in queue',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserRole();
    this.loadApplications();
  }

  loadCurrentUserRole(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserRole.set(user.role || '');
    }
  }

  loadApplications(): void {
    this.isLoading.set(true);

    // Load applications based on user role
    // For now, load all applications - can be filtered server-side later
    this.applicationService.getAllApplications(0, 100).subscribe({
      next: (response) => {
        // Filter applications relevant to the current user's role
        const apps = response.data.content.filter(app => this.isRelevantForRole(app));
        this.applications.set(apps);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.sweetAlertService.error('Error', 'Failed to load applications. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  // Determine if application is relevant for the current user's role
  isRelevantForRole(app: ApplicationResponse): boolean {
    const role = this.currentUserRole();
    const status = app.status;

    switch (role) {
      case UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY:
        return status === 'UNDER_RAS_REVIEW';
      case UserRole.REGIONAL_COMMISSIONER:
        return status === 'UNDER_RC_REVIEW';
      case UserRole.MINISTER_OF_WORKS:
        return ['UNDER_MINISTER_REVIEW', 'RECOMMENDATION_SUBMITTED'].includes(status);
      case UserRole.NRCC_CHAIRPERSON:
        return ['WITH_NRCC_CHAIR', 'NRCC_REVIEW_MEETING'].includes(status);
      case UserRole.NRCC_MEMBER:
        return ['VERIFICATION_IN_PROGRESS', 'NRCC_REVIEW_MEETING'].includes(status);
      case UserRole.NRCC_SECRETARIAT:
        return !['DRAFT', 'GAZETTED', 'APPEAL_CLOSED'].includes(status);
      case UserRole.MINISTRY_LAWYER:
        return ['APPROVED', 'PENDING_GAZETTEMENT'].includes(status);
      case UserRole.SYSTEM_ADMINISTRATOR:
        return true; // Admin sees all
      default:
        return true; // Show all by default
    }
  }

  // Status categorization helpers
  isPendingForRole(app: ApplicationResponse): boolean {
    const role = this.currentUserRole();
    const status = app.status;

    switch (role) {
      case UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY:
        return status === 'UNDER_RAS_REVIEW';
      case UserRole.REGIONAL_COMMISSIONER:
        return status === 'UNDER_RC_REVIEW';
      case UserRole.MINISTER_OF_WORKS:
        return status === 'UNDER_MINISTER_REVIEW' || status === 'RECOMMENDATION_SUBMITTED';
      case UserRole.NRCC_CHAIRPERSON:
        return status === 'WITH_NRCC_CHAIR';
      case UserRole.NRCC_MEMBER:
        return status === 'VERIFICATION_IN_PROGRESS';
      case UserRole.MINISTRY_LAWYER:
        return status === 'APPROVED';
      default:
        return ['SUBMITTED', 'UNDER_RAS_REVIEW', 'UNDER_RC_REVIEW', 'UNDER_MINISTER_REVIEW', 'WITH_NRCC_CHAIR'].includes(status);
    }
  }

  isInProgressForRole(app: ApplicationResponse): boolean {
    return ['VERIFICATION_IN_PROGRESS', 'NRCC_REVIEW_MEETING', 'PENDING_GAZETTEMENT'].includes(app.status);
  }

  isCompletedStatus(app: ApplicationResponse): boolean {
    return ['APPROVED', 'DISAPPROVED_REFUSED', 'DISAPPROVED_DESIGNATED', 'GAZETTED', 'APPEAL_CLOSED'].includes(app.status);
  }

  // Action visibility checks
  canForward(app: ApplicationResponse): boolean {
    const role = this.currentUserRole();
    const status = app.status;

    switch (role) {
      case UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY:
        return status === 'UNDER_RAS_REVIEW';
      case UserRole.REGIONAL_COMMISSIONER:
        return status === 'UNDER_RC_REVIEW';
      case UserRole.MINISTER_OF_WORKS:
        return status === 'UNDER_MINISTER_REVIEW';
      case UserRole.NRCC_CHAIRPERSON:
        return status === 'NRCC_REVIEW_MEETING';
      default:
        return false;
    }
  }

  canApprove(app: ApplicationResponse): boolean {
    const role = this.currentUserRole();
    const status = app.status;

    switch (role) {
      case UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY:
        return status === 'UNDER_RAS_REVIEW';
      case UserRole.REGIONAL_COMMISSIONER:
        return status === 'UNDER_RC_REVIEW';
      case UserRole.MINISTER_OF_WORKS:
        return status === 'RECOMMENDATION_SUBMITTED';
      default:
        return false;
    }
  }

  canReturn(app: ApplicationResponse): boolean {
    const role = this.currentUserRole();
    const status = app.status;

    // Most reviewers can return applications for correction
    const returnableStatuses = [
      'UNDER_RAS_REVIEW',
      'UNDER_RC_REVIEW',
      'UNDER_MINISTER_REVIEW',
      'WITH_NRCC_CHAIR',
      'VERIFICATION_IN_PROGRESS'
    ];

    return returnableStatuses.includes(status);
  }

  // Filter methods
  filterApplications(filter: string): void {
    this.selectedFilter.set(filter);
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  // Action methods
  viewApplication(app: ApplicationResponse): void {
    // Navigate to reviewer application detail page
    this.router.navigate(['/reviewer/applications', app.id]);
  }

  async forwardApplication(app: ApplicationResponse): Promise<void> {
    const role = this.currentUserRole();
    const status = app.status;

    // Determine next step label for the dialog
    let nextStep = 'next reviewer';
    let dialogTitle = 'Forward Application';
    let placeholder = 'Enter your comments...';

    if (role === UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY) {
      nextStep = 'Regional Commissioner (RC)';
      placeholder = 'Enter your review comments before forwarding to RC...';
    } else if (role === UserRole.REGIONAL_COMMISSIONER) {
      nextStep = 'Minister of Works';
      placeholder = 'Enter your review comments before forwarding to Minister...';
    } else if (role === UserRole.MINISTER_OF_WORKS) {
      nextStep = 'NRCC Chair';
      dialogTitle = 'Forward to NRCC';
      placeholder = 'Enter your comments for NRCC review...';
    } else if (role === UserRole.NRCC_CHAIRPERSON) {
      dialogTitle = 'Submit Recommendation';
      nextStep = 'Minister for final decision';
      placeholder = 'Enter the NRCC recommendation...';
    }

    const result = await this.sweetAlertService.confirmWithComment(
      dialogTitle,
      `Forward application <strong>${app.applicationNumber}</strong> to ${nextStep}?`,
      placeholder,
      'Forward',
      'Cancel',
      '#3b82f6',
      false
    );

    if (!result.confirmed) return;

    const comments = result.comment || `Forwarded by ${this.getRoleName(role)}`;

    // Determine the correct action based on role and status
    if (role === UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY && status === 'UNDER_RAS_REVIEW') {
      this.applicationService.rasApprove(app.id, { comments }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to RC.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.REGIONAL_COMMISSIONER && status === 'UNDER_RC_REVIEW') {
      this.applicationService.rcApprove(app.id, { comments }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to Minister.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.MINISTER_OF_WORKS && status === 'UNDER_MINISTER_REVIEW') {
      this.applicationService.forwardToNrccChair(app.id, { comments }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to NRCC Chair.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.NRCC_CHAIRPERSON && status === 'NRCC_REVIEW_MEETING') {
      this.applicationService.submitRecommendation(app.id, { comments }).subscribe({
        next: () => {
          this.sweetAlertService.success('Submitted!', 'Recommendation submitted to Minister.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'submit recommendation')
      });
    }
  }

  private getRoleName(role: string): string {
    const roleNames: Record<string, string> = {
      [UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY]: 'RAS',
      [UserRole.REGIONAL_COMMISSIONER]: 'RC',
      [UserRole.MINISTER_OF_WORKS]: 'Minister',
      [UserRole.NRCC_CHAIRPERSON]: 'NRCC Chair',
      [UserRole.NRCC_MEMBER]: 'NRCC Member',
      [UserRole.NRCC_SECRETARIAT]: 'NRCC Secretariat',
      [UserRole.MINISTRY_LAWYER]: 'Ministry Lawyer',
      [UserRole.SYSTEM_ADMINISTRATOR]: 'Admin'
    };
    return roleNames[role] || 'Reviewer';
  }

  async approveApplication(app: ApplicationResponse): Promise<void> {
    const role = this.currentUserRole();

    if (role === UserRole.MINISTER_OF_WORKS) {
      // Minister final decision - show decision dialog
      const result = await this.sweetAlertService.decisionDialog(
        'Minister Decision',
        `Make a final decision on road reclassification for <strong>${app.roadName}</strong>.`
      );

      if (result.confirmed && result.decision) {
        this.applicationService.recordMinisterDecision(app.id, {
          decision: result.decision,
          reason: result.reason
        }).subscribe({
          next: () => {
            if (result.decision === 'APPROVE') {
              this.sweetAlertService.success('Approved!', 'Application has been approved.');
            } else {
              this.sweetAlertService.success('Decision Recorded', 'Application has been disapproved.');
            }
            this.loadApplications();
          },
          error: (error) => this.handleError(error, 'record decision')
        });
      }
    } else {
      // Other roles forward to next stage with comments
      await this.forwardApplication(app);
    }
  }

  async returnForCorrection(app: ApplicationResponse): Promise<void> {
    const result = await this.sweetAlertService.returnForCorrectionDialog(app.applicationNumber);

    if (result.confirmed) {
      this.applicationService.returnForCorrection(app.id, {
        comments: result.comments
      }).subscribe({
        next: () => {
          this.sweetAlertService.success('Returned!', 'Application returned for correction.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'return')
      });
    }
  }

  private handleError(error: any, action: string): void {
    console.error(`Error ${action} application:`, error);
    this.sweetAlertService.error('Error', `Failed to ${action} application. Please try again.`);
  }

  // Helper methods
  getStatusLabel(status: string): string {
    return ApplicationStatusLabels[status] || status;
  }

  getStatusColor(status: string): { bg: string; text: string } {
    return ApplicationStatusColors[status] || { bg: '#f1f5f9', text: '#475569' };
  }
}
