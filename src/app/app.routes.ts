import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent)
  },
  // Applicant Routes
  {
    path: 'applicant/dashboard',
    loadComponent: () => import('./features/applicant/dashboard/applicant-dashboard').then(m => m.ApplicantDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.APPLICANT])]
  },
  {
    path: 'applicant/applications',
    loadComponent: () => import('./features/applicant/applications/applications-list').then(m => m.ApplicationsListComponent),
    canActivate: [authGuard, roleGuard([UserRole.APPLICANT])]
  },
  {
    path: 'applicant/applications/:id',
    loadComponent: () => import('./features/applicant/application-detail/application-detail').then(m => m.ApplicationDetailComponent),
    canActivate: [authGuard, roleGuard([UserRole.APPLICANT])]
  },
  // Reviewer Routes - District
  {
    path: 'reviewer/district/dashboard',
    loadComponent: () => import('./features/reviewer/dashboard/reviewer-dashboard').then(m => m.ReviewerDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.DISTRICT_REVIEWER])]
  },
  // Reviewer Routes - Regional
  {
    path: 'reviewer/regional/dashboard',
    loadComponent: () => import('./features/reviewer/dashboard/reviewer-dashboard').then(m => m.ReviewerDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.REGIONAL_REVIEWER])]
  },
  // Reviewer Routes - National
  {
    path: 'reviewer/national/dashboard',
    loadComponent: () => import('./features/reviewer/dashboard/reviewer-dashboard').then(m => m.ReviewerDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.NATIONAL_REVIEWER])]
  },
  // NRCC Routes
  {
    path: 'nrcc/dashboard',
    loadComponent: () => import('./features/reviewer/dashboard/reviewer-dashboard').then(m => m.ReviewerDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.NRCC_MEMBER])]
  },
  // Admin Routes
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/reviewer/dashboard/reviewer-dashboard').then(m => m.ReviewerDashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
