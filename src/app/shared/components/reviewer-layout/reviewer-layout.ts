import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-reviewer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reviewer-layout.html',
  styleUrl: './reviewer-layout.scss'
})
export class ReviewerLayoutComponent {
  currentUser: User | null = null;
  reviewerLevel: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
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

  navigateToDashboard(): void {
    this.router.navigate(['/reviewer/dashboard']);
  }

  navigateToQueue(): void {
    this.router.navigate(['/reviewer/applications-queue']);
  }
}
