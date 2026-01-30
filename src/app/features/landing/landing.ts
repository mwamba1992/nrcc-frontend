import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  isMobileMenuOpen = false;
  showLoginModal = false;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  startApplication(): void {
    // Users need to sign in first to apply
    this.showLoginModal = true;
  }

  existingUserLogin(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  applyNow(type: string): void {
    // Users need to sign in first to apply
    this.showLoginModal = true;
  }

  trackApplication(): void {
    // Users need to sign in to track applications
    this.showLoginModal = true;
  }

  nrccPortal(): void {
    this.showLoginModal = true;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  async onLoginSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const credentials = this.loginForm.value;
      await this.authService.login(credentials);
      this.closeLoginModal();
      const dashboardRoute = this.authService.getDashboardRoute();
      this.router.navigate([dashboardRoute]);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
