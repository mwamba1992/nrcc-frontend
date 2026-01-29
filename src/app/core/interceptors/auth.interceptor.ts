import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);

  // Get the auth token from localStorage
  const token = localStorage.getItem('authToken');

  // Debug logging (can be removed in production)
  console.log('🔐 Auth Interceptor:', {
    url: req.url,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'none'
  });

  // Clone the request and add the authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('🚫 HTTP Error:', error.status, error.url);

      if (error.status === 401) {
        // Only redirect to login for auth-specific endpoints
        // Don't redirect for general API failures to avoid disrupting user experience
        const isAuthEndpoint = error.url?.includes('/auth/') ||
                               error.url?.includes('/login') ||
                               error.url?.includes('/profile');

        if (isAuthEndpoint) {
          console.warn('401 Unauthorized on auth endpoint - Clearing tokens and redirecting to login');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          router.navigate(['/']);
        } else {
          console.warn('401 Unauthorized - API call failed, but keeping user logged in:', error.url);
        }
      } else if (error.status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('403 Forbidden - User may not have required permissions for:', error.url);
      }
      return throwError(() => error);
    })
  );
};
