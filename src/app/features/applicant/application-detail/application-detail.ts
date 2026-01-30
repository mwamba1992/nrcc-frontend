import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicantLayoutComponent } from '../../../shared/components/applicant-layout/applicant-layout';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { ApplicationDetailResponse, ApplicationStatus } from '../../../core/models/application.model';

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
  imports: [CommonModule, FormsModule, RouterModule, ApplicantLayoutComponent, ReviewerLayoutComponent],
  templateUrl: './application-detail.html',
  styleUrl: './application-detail.scss'
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: ApplicationDetailResponse | null = null;
  isLoading = true;
  activeTab: 'overview' | 'workflow' | 'documents' | 'comments' = 'overview';

  // Determine if this is reviewer/admin view based on route
  isReviewerView = false;

  comments: Comment[] = [];
  approvalSteps: ApprovalStep[] = [];
  newComment: string = '';

  ApplicationStatus = ApplicationStatus;

  // Classification requirements for comparison table
  classificationCriteria = {
    TRUNK: {
      minWidth: 7,
      minLength: 50,
      trafficLevel: 'High',
      description: 'National importance, connects major cities'
    },
    REGIONAL: {
      minWidth: 6,
      minLength: 20,
      trafficLevel: 'Medium-High',
      description: 'Regional significance, connects districts'
    },
    DISTRICT: {
      minWidth: 5,
      minLength: 10,
      trafficLevel: 'Medium',
      description: 'Local importance, connects towns'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private sweetAlertService: SweetAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    console.log('🔍 ApplicationDetail ngOnInit - ID:', this.applicationId);

    // Check if we're in reviewer context based on URL
    const currentUrl = this.router.url;
    this.isReviewerView = currentUrl.includes('/reviewer/') || currentUrl.includes('/admin/') || currentUrl.includes('/nrcc/');
    console.log('🔍 Current URL:', currentUrl, '| isReviewerView:', this.isReviewerView);

    this.loadApplicationDetails();
  }

  loadApplicationDetails(): void {
    this.isLoading = true;
    console.log('📡 Loading application details...');

    const id = parseInt(this.applicationId, 10);
    if (isNaN(id)) {
      console.error('❌ Invalid application ID:', this.applicationId);
      this.sweetAlertService.error('Error', 'Invalid application ID');
      this.goBack();
      return;
    }

    console.log('📡 Calling API for application ID:', id);
    this.applicationService.getApplicationById(id).subscribe({
      next: (response) => {
        console.log('✅ API Response received:', response);
        if (response.success && response.data) {
          console.log('✅ Application data:', response.data);
          this.application = response.data;
          this.buildApprovalSteps();
          this.buildComments();
        } else {
          console.warn('⚠️ API returned success=false or no data');
          this.sweetAlertService.error('Error', 'Application not found');
          this.goBack();
        }
        this.isLoading = false;
        console.log('✅ Loading complete, isLoading:', this.isLoading);
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.sweetAlertService.error('Error', 'Failed to load application details');
        this.isLoading = false;
        // Load mock data for development
        console.log('📦 Loading mock data as fallback...');
        this.loadMockData();
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  private loadMockData(): void {
    // Mock data fallback for development
    this.application = {
      id: parseInt(this.applicationId, 10) || 1,
      applicationNumber: 'NRCC/2026/0001',
      applicantType: 'INDIVIDUAL',
      applicantTypeDisplayName: 'Individual',
      applicantId: 1,
      applicantName: 'John Applicant',
      applicantEmail: 'applicant@test.com',
      status: 'UNDER_MINISTER_REVIEW',
      statusDisplayName: 'Under Minister Review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: {
        roadName: 'Makumbusho Road',
        roadLength: 15.5,
        currentClass: 'DISTRICT',
        proposedClass: 'REGIONAL',
        startingPoint: 'Makumbusho Junction',
        terminalPoint: 'Mwenge',
        reclassificationReasons: 'Increased traffic and strategic importance',
        surfaceTypeCarriageway: 'Asphalt',
        carriagewayWidth: 7,
        formationWidth: 12,
        actualRoadReserveWidth: 30,
        trafficLevel: 'HIGH',
        trafficComposition: 'Mixed',
        townsVillagesLinked: 'Makumbusho, Mwenge, Sinza',
        busRoutes: 'Multiple routes',
        publicServices: 'Schools, hospitals nearby'
      },
      eligibilityCriteria: [],
      approvalHistory: [],
      verificationAssignments: []
    };

    this.buildApprovalSteps();
    this.buildComments();
    this.isLoading = false;
  }

  private buildApprovalSteps(): void {
    if (!this.application) return;

    // Build steps from approval history
    const history = this.application.approvalHistory || [];

    this.approvalSteps = [
      {
        id: '1',
        level: 'Submission',
        reviewer: this.application.applicantName,
        status: history.some(h => h.action === 'SUBMIT') ? 'completed' : 'pending',
        date: this.application.submissionDate ? new Date(this.application.submissionDate) : undefined,
        decision: 'approved'
      },
      {
        id: '2',
        level: 'RAS Review',
        reviewer: 'Regional Administrative Secretary',
        status: this.getStepStatus('UNDER_RAS_REVIEW'),
        comments: history.find(h => h.fromStatus === 'UNDER_RAS_REVIEW')?.comments
      },
      {
        id: '3',
        level: 'RC Review',
        reviewer: 'Regional Commissioner',
        status: this.getStepStatus('UNDER_RC_REVIEW'),
        comments: history.find(h => h.fromStatus === 'UNDER_RC_REVIEW')?.comments
      },
      {
        id: '4',
        level: 'Minister Review',
        reviewer: 'Minister of Works',
        status: this.getStepStatus('UNDER_MINISTER_REVIEW'),
        comments: history.find(h => h.fromStatus === 'UNDER_MINISTER_REVIEW')?.comments
      },
      {
        id: '5',
        level: 'NRCC Verification',
        reviewer: 'NRCC Committee',
        status: this.getStepStatus('VERIFICATION_IN_PROGRESS'),
      },
      {
        id: '6',
        level: 'Final Decision',
        reviewer: 'Minister of Works',
        status: this.getStepStatus('APPROVED'),
      }
    ];
  }

  private getStepStatus(stepStatus: string): 'completed' | 'current' | 'pending' {
    if (!this.application) return 'pending';

    const statusOrder = [
      'DRAFT', 'SUBMITTED', 'UNDER_RAS_REVIEW', 'UNDER_RC_REVIEW',
      'UNDER_MINISTER_REVIEW', 'WITH_NRCC_CHAIR', 'VERIFICATION_IN_PROGRESS',
      'NRCC_REVIEW_MEETING', 'RECOMMENDATION_SUBMITTED', 'APPROVED', 'GAZETTED'
    ];

    const currentIndex = statusOrder.indexOf(this.application.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  }

  private buildComments(): void {
    if (!this.application) return;

    // Build comments from approval history
    this.comments = (this.application.approvalHistory || []).map((action, index) => ({
      id: action.id?.toString() || index.toString(),
      author: action.actorName,
      role: action.actorRole,
      content: action.comments || `${action.action}: ${action.fromStatus} → ${action.toStatus}`,
      timestamp: new Date(action.actionDate)
    }));
  }

  setActiveTab(tab: 'overview' | 'workflow' | 'documents' | 'comments'): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'DRAFT': 'status-draft',
      'SUBMITTED': 'status-submitted',
      'UNDER_RAS_REVIEW': 'status-review',
      'UNDER_RC_REVIEW': 'status-review',
      'UNDER_MINISTER_REVIEW': 'status-review',
      'WITH_NRCC_CHAIR': 'status-review',
      'VERIFICATION_IN_PROGRESS': 'status-review',
      'NRCC_REVIEW_MEETING': 'status-review',
      'RECOMMENDATION_SUBMITTED': 'status-review',
      'APPROVED': 'status-approved',
      'GAZETTED': 'status-approved',
      'DISAPPROVED_REFUSED': 'status-rejected',
      'RETURNED_FOR_CORRECTION': 'status-changes'
    };
    return statusClasses[status] || 'status-pending';
  }

  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'DRAFT': 'Draft',
      'SUBMITTED': 'Submitted',
      'UNDER_RAS_REVIEW': 'RAS Review',
      'UNDER_RC_REVIEW': 'RC Review',
      'UNDER_MINISTER_REVIEW': 'Minister Review',
      'WITH_NRCC_CHAIR': 'NRCC Chair',
      'VERIFICATION_IN_PROGRESS': 'Verification',
      'NRCC_REVIEW_MEETING': 'NRCC Meeting',
      'RECOMMENDATION_SUBMITTED': 'Recommended',
      'APPROVED': 'Approved',
      'GAZETTED': 'Gazetted',
      'DISAPPROVED_REFUSED': 'Refused',
      'RETURNED_FOR_CORRECTION': 'Returned'
    };
    return statusLabels[status] || status;
  }

  goBack(): void {
    if (this.isReviewerView) {
      this.router.navigate(['/reviewer/applications-queue']);
    } else {
      this.router.navigate(['/applicant/applications']);
    }
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        id: Date.now().toString(),
        author: 'You',
        role: this.isReviewerView ? 'Reviewer' : 'Applicant',
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

  // Helper for template
  formatClassification(value: string): string {
    const classMap: Record<string, string> = {
      'DISTRICT': 'District Road',
      'REGIONAL': 'Regional Road',
      'TRUNK': 'Trunk Road'
    };
    return classMap[value] || value;
  }

  // Get priority based on various factors
  getPriority(): { level: 'high' | 'medium' | 'low'; label: string } {
    if (!this.application) return { level: 'low', label: 'Low' };

    // High priority: Trunk road changes or long roads
    const proposedClass = this.application.formData?.proposedClass;
    const roadLength = this.application.formData?.roadLength || 0;

    if (proposedClass === 'TRUNK' || roadLength > 100) {
      return { level: 'high', label: 'High' };
    }
    if (proposedClass === 'REGIONAL' || roadLength > 30) {
      return { level: 'medium', label: 'Medium' };
    }
    return { level: 'low', label: 'Low' };
  }

  // Get time since submission
  getTimeInReview(): string {
    if (!this.application?.submissionDate) return '-';
    const submitted = new Date(this.application.submissionDate);
    const now = new Date();
    const diffMs = now.getTime() - submitted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 30) return `${Math.floor(diffDays / 30)} months`;
    if (diffDays > 0) return `${diffDays} days`;
    return 'Today';
  }

  // Get criteria for a classification
  getCriteria(classType: string): { minWidth: number; minLength: number; trafficLevel: string; description: string } {
    return this.classificationCriteria[classType as keyof typeof this.classificationCriteria] ||
           { minWidth: 0, minLength: 0, trafficLevel: '-', description: '-' };
  }

  // Check if road meets proposed classification
  meetsProposedCriteria(): boolean {
    if (!this.application?.formData) return false;
    const proposed = this.application.formData.proposedClass;
    const criteria = this.getCriteria(proposed);
    const width = this.application.formData.carriagewayWidth || 0;
    const length = this.application.formData.roadLength || 0;

    return width >= criteria.minWidth && length >= criteria.minLength;
  }

  // Reviewer action handlers
  onApprove(): void {
    console.log('Approve action triggered');
    // This would trigger the appropriate workflow action
  }

  onRequestInfo(): void {
    console.log('Request more info triggered');
    // This would open a dialog for requesting additional information
  }

  onReject(): void {
    console.log('Reject action triggered');
    // This would trigger rejection workflow
  }
}
