import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { GlobalSearchComponent } from '../global-search/global-search';
import { BreadcrumbsComponent, Breadcrumb } from '../breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-applicant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, GlobalSearchComponent, BreadcrumbsComponent],
  templateUrl: './applicant-layout.html',
  styleUrl: './applicant-layout.scss'
})
export class ApplicantLayoutComponent {
  currentUser: User | null = null;
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Applicant Portal', url: '/applicant' },
    { label: 'Dashboard' }
  ];

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

  onSearch(query: string): void {
    console.log('Search query:', query);
    this.router.navigate(['/applicant/search'], { queryParams: { q: query } });
  }
}
