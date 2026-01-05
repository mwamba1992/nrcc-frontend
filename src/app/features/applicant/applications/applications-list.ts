import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { ApplicantLayoutComponent } from '../../../shared/components/applicant-layout/applicant-layout';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ApplicantLayoutComponent],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.scss'
})
export class ApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = true;
  selectedStatus: string = 'all';
  searchTerm: string = '';

  ApplicationStatus = ApplicationStatus;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    // Mock data
    setTimeout(() => {
      this.applications = [
        {
          id: '1',
          referenceNumber: 'RFB-2026-001',
          roadName: 'Makumbusho Road',
          currentClassification: 'District Road',
          proposedClassification: 'Regional Road',
          roadLength: 15.5,
          district: 'Kinondoni',
          region: 'Dar es Salaam',
          status: ApplicationStatus.PENDING,
          submittedDate: new Date('2026-01-03'),
          lastUpdated: new Date('2026-01-03'),
          applicantId: '1',
          applicantName: 'Test Applicant'
        }
      ];
      this.filteredApplications = [...this.applications];
      this.isLoading = false;
    }, 1000);
  }

  filterApplications(): void {
    this.filteredApplications = this.applications.filter(app => {
      const matchesStatus = this.selectedStatus === 'all' || app.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm ||
        app.referenceNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.roadName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.district.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.filterApplications();
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterApplications();
  }

  getStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'status-pending';
      case ApplicationStatus.UNDER_REVIEW:
        return 'status-review';
      case ApplicationStatus.APPROVED:
        return 'status-approved';
      case ApplicationStatus.REJECTED:
        return 'status-rejected';
      case ApplicationStatus.REQUIRES_CHANGES:
        return 'status-changes';
      default:
        return 'status-pending';
    }
  }

  getStatusLabel(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'Pending';
      case ApplicationStatus.UNDER_REVIEW:
        return 'Under Review';
      case ApplicationStatus.APPROVED:
        return 'Approved';
      case ApplicationStatus.REJECTED:
        return 'Rejected';
      case ApplicationStatus.REQUIRES_CHANGES:
        return 'Requires Changes';
      default:
        return status;
    }
  }

  viewApplication(id: string): void {
    this.router.navigate(['/applicant/applications', id]);
  }

  createNewApplication(): void {
    this.router.navigate(['/applicant/applications/new']);
  }
}
