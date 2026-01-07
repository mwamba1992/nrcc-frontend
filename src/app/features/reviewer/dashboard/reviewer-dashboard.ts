import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { LineChartComponent, ChartData } from '../../../shared/components/line-chart/line-chart';
import { ActivityTimelineComponent, TimelineActivity } from '../../../shared/components/activity-timeline/activity-timeline';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';
import { ApplicationsTableComponent, Application } from '../../../shared/components/applications-table/applications-table';

interface DashboardStats {
  pending: number;
  approved: number;
  reviewed: number;
  total: number;
  avgReviewTime: string;
  slaCompliance: number;
  trend: {
    pending: number;
    approved: number;
    reviewed: number;
  };
  sparklineData: {
    pending: number[];
    approved: number[];
    reviewed: number[];
    total: number[];
  };
}

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReviewerLayoutComponent,
    LineChartComponent,
    ActivityTimelineComponent,
    SkeletonLoaderComponent,
    ApplicationsTableComponent
  ],
  templateUrl: './reviewer-dashboard.html',
  styleUrl: './reviewer-dashboard.scss'
})
export class ReviewerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  reviewerLevel: string = '';
  isLoading = true;

  stats: DashboardStats = {
    pending: 0,
    approved: 0,
    reviewed: 0,
    total: 0,
    avgReviewTime: '0 days',
    slaCompliance: 0,
    trend: { pending: 0, approved: 0, reviewed: 0 },
    sparklineData: {
      pending: [],
      approved: [],
      reviewed: [],
      total: []
    }
  };

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  recentActivities: TimelineActivity[] = [];
  applications: Application[] = [];
  activeFilter: 'all' | 'pending' | 'reviewed' | 'forwarded' = 'all';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.setReviewerLevel();
    this.loadDashboardData();
  }

  setReviewerLevel(): void {
    switch (this.currentUser?.role) {
      case UserRole.DISTRICT_REVIEWER:
        this.reviewerLevel = 'District Level';
        break;
      case UserRole.REGIONAL_REVIEWER:
        this.reviewerLevel = 'Regional Level';
        break;
      case UserRole.NATIONAL_REVIEWER:
        this.reviewerLevel = 'National Level';
        break;
      case UserRole.NRCC_MEMBER:
        this.reviewerLevel = 'NRCC Committee';
        break;
      case UserRole.ADMIN:
        this.reviewerLevel = 'System Administrator';
        break;
      default:
        this.reviewerLevel = 'Reviewer';
    }
  }

  loadDashboardData(): void {
    // Simulate API call with mock data
    console.log('Loading dashboard data...');
    setTimeout(() => {
      console.log('Data loaded, setting stats...');
      this.stats = {
        pending: 23,
        approved: 45,
        reviewed: 67,
        total: 135,
        avgReviewTime: '2.3 days',
        slaCompliance: 94,
        trend: {
          pending: 12,
          approved: 15,
          reviewed: 8
        },
        sparklineData: {
          pending: [15, 18, 12, 20, 18, 22, 23],
          approved: [30, 35, 38, 42, 40, 43, 45],
          reviewed: [50, 55, 58, 62, 63, 65, 67],
          total: [95, 108, 108, 124, 121, 130, 135]
        }
      };

      // Chart data for applications trend - INSTITUTIONAL COLORS
      this.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Approved',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#2E7D32', // gov-success (dark emerald)
            backgroundColor: 'rgba(46, 125, 50, 0.15)',
            tension: 0 // No curve smoothing - precise data reading
          },
          {
            label: 'Reviewed',
            data: [15, 23, 18, 28, 25, 33],
            borderColor: '#0D47A1', // gov-info (trust blue)
            backgroundColor: 'rgba(13, 71, 161, 0.15)',
            tension: 0
          },
          {
            label: 'Pending',
            data: [8, 12, 10, 15, 18, 20],
            borderColor: '#F57F17', // gov-warning (amber)
            backgroundColor: 'rgba(245, 127, 23, 0.15)',
            tension: 0
          }
        ]
      };

      // Mock applications for table
      this.applications = [
        {
          id: 'RF-2024-001',
          projectName: 'Road Upgrade Mwanza-Shinyanga',
          district: 'Mwanza',
          submittedDate: new Date('2025-01-05'),
          status: 'pending',
          urgencyLevel: 'due-soon',
          slaDeadline: new Date('2025-01-09'),
          slaDaysRemaining: 2
        },
        {
          id: 'RF-2024-002',
          projectName: 'Bridge Repair Arusha Central',
          district: 'Arusha',
          submittedDate: new Date('2024-12-28'),
          status: 'pending',
          urgencyLevel: 'overdue',
          slaDeadline: new Date('2025-01-06'),
          slaDaysRemaining: -1
        },
        {
          id: 'RF-2024-003',
          projectName: 'Highway Marking Dar-Morogoro',
          district: 'Dar es Salaam',
          submittedDate: new Date('2025-01-04'),
          status: 'reviewed',
          urgencyLevel: 'on-track',
          slaDeadline: new Date('2025-01-14'),
          slaDaysRemaining: 7
        },
        {
          id: 'RF-2024-004',
          projectName: 'Drainage System Dodoma',
          district: 'Dodoma',
          submittedDate: new Date('2025-01-03'),
          status: 'pending',
          urgencyLevel: 'on-track',
          slaDeadline: new Date('2025-01-13'),
          slaDaysRemaining: 6
        },
        {
          id: 'RF-2024-005',
          projectName: 'Culvert Construction Mbeya',
          district: 'Mbeya',
          submittedDate: new Date('2025-01-02'),
          status: 'forwarded',
          urgencyLevel: 'on-track',
          slaDeadline: new Date('2025-01-12'),
          slaDaysRemaining: 5
        }
      ];

      // Recent activities
      this.recentActivities = [
        {
          id: '1',
          type: 'approved',
          title: 'Application #RF-2024-001 approved',
          description: 'Road reclassification for Mwanza District',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          type: 'reviewed',
          title: 'Application #RF-2024-002 reviewed',
          description: 'Completed technical review',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: '3',
          type: 'forwarded',
          title: 'Application #RF-2024-003 forwarded',
          description: 'Forwarded to regional level',
          user: 'You',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
        }
      ];

      console.log('Chart data:', this.chartData);
      console.log('Setting isLoading to false');
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 800);
  }

  setFilter(filter: 'all' | 'pending' | 'reviewed' | 'forwarded'): void {
    this.activeFilter = filter;
  }

  navigateToSettings(): void {
    this.router.navigate(['/reviewer/settings']);
  }

  logout(): void {
    this.authService.logout();
  }

  onViewApplication(applicationId: string): void {
    console.log('View application:', applicationId);
    this.router.navigate(['/reviewer/applications', applicationId]);
  }

  onReviewApplication(applicationId: string): void {
    console.log('Review application:', applicationId);
    this.router.navigate(['/reviewer/applications', applicationId, 'review']);
  }
}
