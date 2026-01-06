import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { ApplicantLayoutComponent } from '../../../shared/components/applicant-layout/applicant-layout';
import { LineChartComponent, ChartData } from '../../../shared/components/line-chart/line-chart';
import { ActivityTimelineComponent, TimelineActivity } from '../../../shared/components/activity-timeline/activity-timeline';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';

interface DashboardStats {
  total: number;
  amountPaid: number;
  approved: number;
  pending: number;
  inReview: number;
  rejected: number;
  trend: {
    total: number;
    approved: number;
  };
}

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ApplicantLayoutComponent,
    LineChartComponent,
    ActivityTimelineComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './applicant-dashboard.html',
  styleUrl: './applicant-dashboard.scss'
})
export class ApplicantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;

  stats: DashboardStats = {
    total: 0,
    amountPaid: 0,
    approved: 0,
    pending: 0,
    inReview: 0,
    rejected: 0,
    trend: { total: 0, approved: 0 }
  };

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  recentActivities: TimelineActivity[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.loadStats();
  }

  loadStats(): void {
    // Simulate API call with mock data
    setTimeout(() => {
      this.stats = {
        total: 8,
        amountPaid: 450000,
        approved: 3,
        pending: 2,
        inReview: 2,
        rejected: 1,
        trend: {
          total: 20,
          approved: 15
        }
      };

      // Chart data for application status over time
      this.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Submitted',
            data: [1, 2, 1, 2, 1, 1],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Approved',
            data: [0, 1, 0, 1, 0, 1],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }
        ]
      };

      // Recent activities
      this.recentActivities = [
        {
          id: '1',
          type: 'submitted',
          title: 'Application submitted',
          description: 'Application #RF-2024-008 submitted successfully',
          user: 'You',
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          type: 'reviewed',
          title: 'Application under review',
          description: 'Application #RF-2024-007 is being reviewed',
          user: 'District Reviewer',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
        },
        {
          id: '3',
          type: 'approved',
          title: 'Application approved',
          description: 'Application #RF-2024-006 has been approved',
          user: 'Regional Reviewer',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        {
          id: '4',
          type: 'updated',
          title: 'Documents uploaded',
          description: 'Additional documents uploaded for #RF-2024-005',
          user: 'You',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48)
        }
      ];

      this.isLoading = false;
      this.cdr.detectChanges();
    }, 600);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applicant/applications']);
  }
}
