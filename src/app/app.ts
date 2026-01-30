import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showHeader = false;

  constructor(private router: Router) {
    // Check initial URL
    this.checkHeaderVisibility(this.router.url);

    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkHeaderVisibility(event.url);
    });
  }

  private checkHeaderVisibility(url: string): void {
    // Hide header on landing page (has integrated header) and dashboard pages (have layouts)
    this.showHeader = url !== '/' &&
                      !url.includes('/applicant/') &&
                      !url.includes('/reviewer/') &&
                      !url.includes('/nrcc/') &&
                      !url.includes('/admin/');
  }
}
