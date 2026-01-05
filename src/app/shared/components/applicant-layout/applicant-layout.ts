import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-applicant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './applicant-layout.html',
  styleUrl: './applicant-layout.scss'
})
export class ApplicantLayoutComponent {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/applicant/dashboard']);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applicant/applications']);
  }
}
