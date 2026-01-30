import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicantLayoutComponent } from '../../../shared/components/applicant-layout/applicant-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { ApplicationService } from '../../../core/services/application.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { ApplicationResponse } from '../../../core/models/application.model';
import { NewApplicationComponent } from '../new-application/new-application';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ApplicantLayoutComponent,
    DataTableComponent,
    NewApplicationComponent
  ],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.scss'
})
export class ApplicationsListComponent implements OnInit {
  applications = signal<ApplicationResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);

  // Filters
  selectedStatusFilter = signal<string>('');

  // Available statuses for filtering
  statuses = [
    'DRAFT',
    'SUBMITTED',
    'UNDER_RAS_REVIEW',
    'UNDER_RC_REVIEW',
    'UNDER_MINISTER_REVIEW',
    'WITH_NRCC_CHAIR',
    'VERIFICATION_IN_PROGRESS',
    'NRCC_REVIEW_MEETING',
    'RECOMMENDATION_SUBMITTED',
    'MINISTER_DECISION',
    'APPROVED',
    'PENDING_GAZETTEMENT',
    'GAZETTED',
    'DISAPPROVED_REFUSED',
    'RETURNED_FOR_CORRECTION'
  ];

  // Filtered applications
  filteredApplications = computed(() => {
    let result = this.applications();
    const statusFilter = this.selectedStatusFilter();

    if (statusFilter) {
      result = result.filter(app => app.status === statusFilter);
    }
    return result;
  });

  // Table configuration
  tableColumns: DataTableColumn<ApplicationResponse>[] = [
    {
      key: 'applicationNumber',
      label: 'Reference No.',
      sortable: true,
      width: '150px',
      class: 'reference-cell'
    },
    {
      key: 'roadName',
      label: 'Road Name',
      sortable: true
    },
    {
      key: 'currentClass',
      label: 'Current Class',
      sortable: true,
      width: '130px',
      format: (value) => this.formatClassification(value)
    },
    {
      key: 'proposedClass',
      label: 'Proposed Class',
      sortable: true,
      width: '130px',
      format: (value) => this.formatClassification(value)
    },
    {
      key: 'applicantType',
      label: 'Applicant Type',
      sortable: true,
      width: '140px',
      format: (value) => this.formatApplicantType(value)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '160px',
      align: 'center',
      class: 'status-cell',
      format: (value) => this.formatStatus(value)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      width: '120px',
      format: (value) => this.formatDate(value)
    }
  ];

  tableActions: DataTableAction<ApplicationResponse>[] = [
    {
      label: 'View',
      icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      class: 'info',
      onClick: (row) => this.viewApplication(row)
    },
    {
      label: 'Submit',
      icon: '<path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>',
      class: 'success',
      onClick: (row) => this.submitApplication(row),
      visible: (row) => row.status === 'DRAFT'
    },
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      class: 'primary',
      onClick: (row) => this.editApplication(row),
      visible: (row) => row.status === 'DRAFT' || row.status === 'RETURNED_FOR_CORRECTION'
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      class: 'danger',
      onClick: (row) => this.deleteApplication(row),
      visible: (row) => row.status === 'DRAFT'
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search applications by reference, road name, district...',
    emptyMessage: 'No applications found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.applicationService.getMyApplications(0, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.applications.set(response.data.content || []);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.sweetAlertService.error('Error', 'Failed to load applications. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  // ==================== FILTER METHODS ====================

  onStatusFilterChange(status: string): void {
    this.selectedStatusFilter.set(status);
  }

  clearFilters(): void {
    this.selectedStatusFilter.set('');
  }

  // ==================== FORMAT METHODS ====================

  formatClassification(value: string): string {
    if (!value) return '-';
    const classMap: Record<string, string> = {
      'DISTRICT': 'District Road',
      'REGIONAL': 'Regional Road',
      'TRUNK': 'Trunk Road'
    };
    return classMap[value] || value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatApplicantType(value: string): string {
    if (!value) return '-';
    const typeMap: Record<string, string> = {
      'INDIVIDUAL': 'Individual',
      'GROUP': 'Group',
      'MEMBER_OF_PARLIAMENT': 'MP',
      'REGIONAL_ROADS_BOARD': 'RRB'
    };
    return typeMap[value] || value;
  }

  formatStatus(status: string): string {
    if (!status) return '-';
    const statusMap: Record<string, string> = {
      'DRAFT': 'Draft',
      'SUBMITTED': 'Submitted',
      'UNDER_RAS_REVIEW': 'RAS Review',
      'UNDER_RC_REVIEW': 'RC Review',
      'UNDER_MINISTER_REVIEW': 'Minister Review',
      'WITH_NRCC_CHAIR': 'NRCC Chair',
      'VERIFICATION_IN_PROGRESS': 'Verification',
      'NRCC_REVIEW_MEETING': 'NRCC Meeting',
      'RECOMMENDATION_SUBMITTED': 'Recommended',
      'MINISTER_DECISION': 'Decision',
      'APPROVED': 'Approved',
      'PENDING_GAZETTEMENT': 'Pending Gazette',
      'GAZETTED': 'Gazetted',
      'DISAPPROVED_REFUSED': 'Refused',
      'RETURNED_FOR_CORRECTION': 'Returned'
    };
    return statusMap[status] || status.replace(/_/g, ' ');
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ==================== ACTION METHODS ====================

  viewApplication(application: ApplicationResponse): void {
    this.router.navigate(['/applicant/applications', application.id]);
  }

  editApplication(application: ApplicationResponse): void {
    // Navigate to edit view or open edit modal
    this.router.navigate(['/applicant/applications', application.id, 'edit']);
  }

  async submitApplication(application: ApplicationResponse): Promise<void> {
    const confirmed = await this.sweetAlertService.confirm(
      'Submit Application',
      `Are you sure you want to submit "${application.roadName}" for review? Once submitted, you cannot edit it unless returned.`,
      'Yes, Submit',
      'Cancel'
    );

    if (confirmed) {
      this.applicationService.submitApplication(application.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Submitted!', 'Your application has been submitted for review.');
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          const message = error.error?.message || 'Failed to submit application. Please try again.';
          this.sweetAlertService.error('Error', message);
        }
      });
    }
  }

  async deleteApplication(application: ApplicationResponse): Promise<void> {
    const confirmed = await this.sweetAlertService.confirmDelete(
      application.roadName || 'this application',
      'application'
    );

    if (confirmed) {
      this.applicationService.deleteApplication(application.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', 'Application has been deleted successfully.');
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error deleting application:', error);
          this.sweetAlertService.error('Error', 'Failed to delete application. Please try again.');
        }
      });
    }
  }

  // ==================== MODAL METHODS ====================

  openCreateModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onApplicationSubmitted(): void {
    this.showModal.set(false);
    this.loadApplications();
  }
}
