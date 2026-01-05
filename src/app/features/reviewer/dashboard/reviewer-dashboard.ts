import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviewer-dashboard.html',
  styleUrl: './reviewer-dashboard.scss'
})
export class ReviewerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  reviewerLevel: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.setReviewerLevel();
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

  logout(): void {
    this.authService.logout();
  }
}
