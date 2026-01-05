import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/']);
      return false;
    }

    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // Redirect to appropriate dashboard if user doesn't have permission
    router.navigate([authService.getDashboardRoute()]);
    return false;
  };
}
