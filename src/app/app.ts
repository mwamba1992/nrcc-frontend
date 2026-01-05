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
  showHeader = true;

  constructor(private router: Router) {
    // Hide header on dashboard pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.showHeader = !url.includes('/applicant/') &&
                        !url.includes('/reviewer/') &&
                        !url.includes('/nrcc/') &&
                        !url.includes('/admin/');
    });
  }
}
