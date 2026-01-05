import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';

interface Application {
  id: string;
  referenceNumber: string;
  roadName: string;
  district: string;
  region: string;
  currentClassification: string;
  proposedClassification: string;
  submittedBy: string;
  submittedDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'under_review' | 'changes_required';
  daysWaiting: number;
}

@Component({
  selector: 'app-applications-queue',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewerLayoutComponent],
  templateUrl: './applications-queue.html',
  styleUrl: './applications-queue.scss'
})
export class ApplicationsQueueComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedFilter: string = 'all';
  searchTerm: string = '';
  selectedPriority: string = 'all';
  selectedApplication: Application | null = null;
  showReviewModal = false;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    // Mock data - replace with actual API call
    this.applications = [
      {
        id: '1',
        referenceNumber: 'RFB-2026-001',
        roadName: 'Makumbusho Road',
        district: 'Kinondoni',
        region: 'Dar es Salaam',
        currentClassification: 'District Road',
        proposedClassification: 'Regional Road',
        submittedBy: 'John Applicant',
        submittedDate: new Date('2026-01-03'),
        priority: 'high',
        status: 'pending',
        daysWaiting: 2
      },
      {
        id: '2',
        referenceNumber: 'RFB-2026-002',
        roadName: 'Msasani Peninsula Road',
        district: 'Kinondoni',
        region: 'Dar es Salaam',
        currentClassification: 'Local Road',
        proposedClassification: 'District Road',
        submittedBy: 'Jane Smith',
        submittedDate: new Date('2026-01-01'),
        priority: 'medium',
        status: 'under_review',
        daysWaiting: 4
      },
      {
        id: '3',
        referenceNumber: 'RFB-2026-003',
        roadName: 'Oysterbay Drive',
        district: 'Kinondoni',
        region: 'Dar es Salaam',
        currentClassification: 'District Road',
        proposedClassification: 'Regional Road',
        submittedBy: 'Mike Johnson',
        submittedDate: new Date('2025-12-28'),
        priority: 'high',
        status: 'changes_required',
        daysWaiting: 8
      }
    ];
    this.filteredApplications = [...this.applications];
  }

  filterApplications(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  filterByPriority(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.applications];

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(app => app.status === this.selectedFilter);
    }

    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(app => app.priority === this.selectedPriority);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(app =>
        app.roadName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.referenceNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredApplications = filtered;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'Pending Review',
      'under_review': 'Under Review',
      'changes_required': 'Changes Required'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  openReviewModal(application: Application): void {
    this.selectedApplication = application;
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedApplication = null;
  }

  approveApplication(application: Application): void {
    console.log('Approve:', application);
    // Implement approval logic
  }

  rejectApplication(application: Application): void {
    console.log('Reject:', application);
    // Implement rejection logic
  }

  requestChanges(application: Application): void {
    console.log('Request changes:', application);
    // Implement request changes logic
  }
}
