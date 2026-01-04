import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginModalComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  isLoginModalOpen = false;

  constructor(private router: Router) {}

  onSignIn(): void {
    this.isLoginModalOpen = true;
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }
}
