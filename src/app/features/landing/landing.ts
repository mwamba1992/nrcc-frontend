import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  startApplication(): void {
    this.router.navigate(['/apply']);
  }

  existingUserLogin(): void {
    this.router.navigate(['/login']);
  }

  applyNow(type: string): void {
    this.router.navigate(['/apply'], { queryParams: { type } });
  }

  trackApplication(): void {
    this.router.navigate(['/track']);
  }

  nrccPortal(): void {
    this.router.navigate(['/login'], { queryParams: { portal: 'nrcc' } });
  }
}
