import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicantLayoutComponent } from '../../../shared/components/applicant-layout/applicant-layout';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: Date;
  avatar?: string;
}

interface ApprovalStep {
  id: string;
  level: string;
  reviewer: string;
  status: 'completed' | 'current' | 'pending';
  date?: Date;
  comments?: string;
  decision?: 'approved' | 'rejected' | 'changes_required';
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ApplicantLayoutComponent],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.scss'
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: Application | null = null;
  isLoading = true;
  activeTab: 'overview' | 'workflow' | 'documents' | 'comments' = 'overview';

  comments: Comment[] = [];
  approvalSteps: ApprovalStep[] = [];
  newComment: string = '';

  ApplicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    this.loadApplicationDetails();
  }

  loadApplicationDetails(): void {
    // Mock data - no loading delay
    this.application = {
      id: this.applicationId,
      referenceNumber: 'RFB-2026-001',
      roadName: 'Makumbusho Road',
      currentClassification: 'District Road',
      proposedClassification: 'Regional Road',
      roadLength: 15.5,
      district: 'Kinondoni',
      region: 'Dar es Salaam',
      status: ApplicationStatus.UNDER_REVIEW,
      submittedDate: new Date('2026-01-03'),
      lastUpdated: new Date('2026-01-04'),
      applicantId: '1',
      applicantName: 'John Applicant',
      description: 'Request to upgrade Makumbusho Road from district to regional classification due to increased traffic volume and strategic importance.',
      justification: 'This road serves as a major connector between residential areas and commercial zones. Traffic studies show 5000+ vehicles daily.'
    };

    this.approvalSteps = [
      {
        id: '1',
        level: 'District Level',
        reviewer: 'District Engineer - Kinondoni',
        status: 'completed',
        date: new Date('2026-01-03'),
        decision: 'approved',
        comments: 'Application meets all district-level requirements. Traffic assessment data is comprehensive.'
      },
      {
        id: '2',
        level: 'Regional Level',
        reviewer: 'Regional Roads Engineer - Dar es Salaam',
        status: 'current',
        date: new Date('2026-01-04'),
        comments: 'Currently under review. Awaiting technical assessment report.'
      },
      {
        id: '3',
        level: 'National Level',
        reviewer: 'Chief Engineer - TANROADS',
        status: 'pending'
      },
      {
        id: '4',
        level: 'NRCC Approval',
        reviewer: 'National Road Classification Committee',
        status: 'pending'
      }
    ];

    this.comments = [
      {
        id: '1',
        author: 'District Engineer',
        role: 'District Reviewer',
        content: 'The traffic volume data provided supports the reclassification request. Please ensure all environmental impact assessments are included.',
        timestamp: new Date('2026-01-03T10:30:00')
      },
      {
        id: '2',
        author: 'John Applicant',
        role: 'Applicant',
        content: 'Thank you for the feedback. Environmental impact assessment has been uploaded to the documents section.',
        timestamp: new Date('2026-01-03T14:20:00')
      },
      {
        id: '3',
        author: 'Regional Engineer',
        role: 'Regional Reviewer',
        content: 'Application is progressing well. We will complete our review within 5 business days.',
        timestamp: new Date('2026-01-04T09:15:00')
      }
    ];

    this.isLoading = false;
  }

  setActiveTab(tab: 'overview' | 'workflow' | 'documents' | 'comments'): void {
    this.activeTab = tab;
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

  goBack(): void {
    this.router.navigate(['/applicant/applications']);
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        id: Date.now().toString(),
        author: 'You',
        role: 'Applicant',
        content: this.newComment,
        timestamp: new Date()
      });
      this.newComment = '';
    }
  }

  downloadDocument(docName: string): void {
    console.log('Downloading:', docName);
    // Implement download logic
  }
}
