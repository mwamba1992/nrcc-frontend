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
    // Navigate to application detail page
    this.router.navigate(['/applicant/applications', app.id]);
  }

  async forwardApplication(app: ApplicationResponse): Promise<void> {
    const role = this.currentUserRole();
    const status = app.status;

    const confirmed = await this.sweetAlertService.confirm(
      'Forward Application',
      `Forward application ${app.applicationNumber} to the next reviewer?`,
      'Yes, forward',
      'Cancel'
    );

    if (!confirmed) return;

    // Determine the correct action based on role and status
    if (role === UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY && status === 'UNDER_RAS_REVIEW') {
      this.applicationService.rasApprove(app.id, { comments: 'Forwarded by RAS' }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to RC.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.REGIONAL_COMMISSIONER && status === 'UNDER_RC_REVIEW') {
      this.applicationService.rcApprove(app.id, { comments: 'Forwarded by RC' }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to Minister.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.MINISTER_OF_WORKS && status === 'UNDER_MINISTER_REVIEW') {
      this.applicationService.forwardToNrccChair(app.id, { comments: 'Forwarded to NRCC for review' }).subscribe({
        next: () => {
          this.sweetAlertService.success('Forwarded!', 'Application forwarded to NRCC Chair.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'forward')
      });
    } else if (role === UserRole.NRCC_CHAIRPERSON && status === 'NRCC_REVIEW_MEETING') {
      this.applicationService.submitRecommendation(app.id, { comments: 'NRCC recommendation submitted' }).subscribe({
        next: () => {
          this.sweetAlertService.success('Submitted!', 'Recommendation submitted to Minister.');
          this.loadApplications();
        },
        error: (error) => this.handleError(error, 'submit recommendation')
      });
    }
  }

  async approveApplication(app: ApplicationResponse): Promise<void> {
    const role = this.currentUserRole();

    if (role === UserRole.MINISTER_OF_WORKS) {
      // Minister final approval
      const confirmed = await this.sweetAlertService.confirm(
        'Approve Application',
        `Approve road reclassification for ${app.roadName}?`,
        'Yes, approve',
        'Cancel'
      );

      if (confirmed) {
        this.applicationService.recordMinisterDecision(app.id, {
          decision: 'APPROVE'
        }).subscribe({
          next: () => {
            this.sweetAlertService.success('Approved!', 'Application has been approved.');
            this.loadApplications();
          },
          error: (error) => this.handleError(error, 'approve')
        });
      }
    } else {
      // Other roles forward to next stage
      await this.forwardApplication(app);
    }
  }

  async returnForCorrection(app: ApplicationResponse): Promise<void> {
    const confirmed = await this.sweetAlertService.confirm(
      'Return for Correction',
      `Return application ${app.applicationNumber} to the applicant for corrections?`,
      'Yes, return',
      'Cancel'
    );

    if (confirmed) {
      this.applicationService.returnForCorrection(app.id, {
        comments: 'Please review and correct the application'
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
