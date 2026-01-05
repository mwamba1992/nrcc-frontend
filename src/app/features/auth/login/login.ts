import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  // Demo accounts for quick access
  demoAccounts = [
    { label: 'Applicant', email: 'applicant@test.com', password: 'password' },
    { label: 'District Reviewer', email: 'district@roadsfund.go.tz', password: 'password' },
    { label: 'Regional Reviewer', email: 'regional@roadsfund.go.tz', password: 'password' },
    { label: 'National Reviewer', email: 'national@roadsfund.go.tz', password: 'password' },
    { label: 'NRCC Member', email: 'nrcc@roadsfund.go.tz', password: 'password' },
    { label: 'Admin', email: 'admin@roadsfund.go.tz', password: 'admin123' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const credentials = this.loginForm.value;
      const response = await this.authService.login(credentials);

      // Navigate to appropriate dashboard
      const dashboardRoute = this.authService.getDashboardRoute();
      this.router.navigate([dashboardRoute]);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.isLoading = false;
    }
  }

  useDemoAccount(email: string, password: string): void {
    this.loginForm.patchValue({ email, password });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
