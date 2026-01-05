import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicant-dashboard.html',
  styleUrl: './applicant-dashboard.scss'
})
export class ApplicantDashboardComponent implements OnInit {
  currentUser: User | null = null;

  stats = {
    total: 0,
    amountPaid: 0,
    approved: 0,
    pending: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.loadStats();
  }

  loadStats(): void {
    // Mock data - replace with actual API call
    this.stats = {
      total: 1,
      amountPaid: 0,
      approved: 0,
      pending: 1
    };
  }

  logout(): void {
    this.authService.logout();
  }
}
