import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  close(): void {
    this.closeModal.emit();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // TODO: Implement actual login logic
    console.log('Login attempt:', this.credentials);
    // For now, just close the modal
    this.close();
  }
}
