import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  credentials = {
    email: '',
    password: ''
  };

  showPassword = false;
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  close(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService.login(this.credentials);

      // Close modal
      this.close();

      // Navigate to appropriate dashboard
      this.router.navigate([this.authService.getDashboardRoute()]);
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.credentials = {
      email: '',
      password: ''
    };
    this.showPassword = false;
    this.errorMessage = '';
    this.isLoading = false;
  }
}
