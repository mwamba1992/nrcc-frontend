import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { LineChartComponent, ChartData } from '../../../shared/components/line-chart/line-chart';
import { ActivityTimelineComponent, TimelineActivity } from '../../../shared/components/activity-timeline/activity-timeline';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';

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
}

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReviewerLayoutComponent,
    LineChartComponent,
    ActivityTimelineComponent,
    SkeletonLoaderComponent
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
    trend: { pending: 0, approved: 0, reviewed: 0 }
  };

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  recentActivities: TimelineActivity[] = [];
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
        }
      };

      // Chart data for applications trend
      this.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Approved',
            data: [12, 19, 15, 25, 22, 30],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          },
          {
            label: 'Reviewed',
            data: [15, 23, 18, 28, 25, 33],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4
          },
          {
            label: 'Pending',
            data: [8, 12, 10, 15, 18, 20],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }
        ]
      };

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

  logout(): void {
    this.authService.logout();
  }
}
