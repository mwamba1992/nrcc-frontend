import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginCredentials } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

// Auth response from backend
interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    status: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public readonly signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor() {
    this.loadUserFromStorage();
  }

  async login(credentials: LoginCredentials): Promise<any> {
    console.log('🔑 Attempting login for:', credentials.email);

    try {
      // Call the real backend API with timeout
      const response = await firstValueFrom(
        this.http.post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/login`, {
          email: credentials.email,
          password: credentials.password
        }).pipe(
          timeout(15000), // 15 second timeout
          catchError(err => {
            console.error('HTTP error in login:', err);
            return throwError(() => err);
          })
        )
      );

      console.log('📥 Login response:', response);

      if (response.success && response.data) {
        const authData = response.data;
        console.log('✅ Login successful, token starts with:', authData.accessToken?.substring(0, 30));

        // Map backend user to frontend User model
        const user: User = {
          id: authData.user.id.toString(),
          email: authData.user.email,
          firstName: authData.user.name.split(' ')[0] || authData.user.name,
          lastName: authData.user.name.split(' ').slice(1).join(' ') || '',
          role: this.mapBackendRole(authData.user.role),
          phone: authData.user.phoneNumber,
          organization: this.getOrganizationFromRole(authData.user.role),
          createdAt: new Date(),
          lastLogin: new Date()
        };

        this.setCurrentUser(user, authData.accessToken, authData.refreshToken);

        return {
          user,
          token: authData.accessToken,
          expiresIn: authData.expiresIn
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle timeout error
      if (error.name === 'TimeoutError') {
        throw new Error('Connection timeout. Please check your network and try again.');
      }

      // If backend is unavailable, fall back to mock auth for development
      if (error.status === 0 || error.status === 504) {
        console.warn('Backend unavailable, using mock authentication');
        return this.mockLogin(credentials);
      }

      throw new Error(error.error?.message || error.message || 'Invalid email or password');
    }
  }

  // Map backend role to frontend UserRole enum
  private mapBackendRole(backendRole: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      'PUBLIC_APPLICANT': UserRole.PUBLIC_APPLICANT,
      'MEMBER_OF_PARLIAMENT': UserRole.MEMBER_OF_PARLIAMENT,
      'REGIONAL_ROADS_BOARD_INITIATOR': UserRole.REGIONAL_ROADS_BOARD_INITIATOR,
      'REGIONAL_ADMINISTRATIVE_SECRETARY': UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY,
      'REGIONAL_COMMISSIONER': UserRole.REGIONAL_COMMISSIONER,
      'MINISTER_OF_WORKS': UserRole.MINISTER_OF_WORKS,
      'NRCC_CHAIRPERSON': UserRole.NRCC_CHAIRPERSON,
      'NRCC_MEMBER': UserRole.NRCC_MEMBER,
      'NRCC_SECRETARIAT': UserRole.NRCC_SECRETARIAT,
      'MINISTRY_LAWYER': UserRole.MINISTRY_LAWYER,
      'SYSTEM_ADMINISTRATOR': UserRole.SYSTEM_ADMINISTRATOR
    };
    return roleMap[backendRole] || UserRole.PUBLIC_APPLICANT;
  }

  private getOrganizationFromRole(role: string): string {
    const orgMap: Record<string, string> = {
      'PUBLIC_APPLICANT': 'Public Applicant',
      'MEMBER_OF_PARLIAMENT': 'Parliament of Tanzania',
      'REGIONAL_ROADS_BOARD_INITIATOR': 'Regional Roads Board',
      'REGIONAL_ADMINISTRATIVE_SECRETARY': 'Regional Administration',
      'REGIONAL_COMMISSIONER': 'Regional Commissioner Office',
      'MINISTER_OF_WORKS': 'Ministry of Works',
      'NRCC_CHAIRPERSON': 'NRCC',
      'NRCC_MEMBER': 'NRCC',
      'NRCC_SECRETARIAT': 'NRCC Secretariat',
      'MINISTRY_LAWYER': 'Ministry of Works - Legal',
      'SYSTEM_ADMINISTRATOR': 'Roads Fund Board'
    };
    return orgMap[role] || 'Roads Fund Board';
  }

  // Mock login fallback for development when backend is unavailable
  private async mockLogin(credentials: LoginCredentials): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUsers: Array<{ email: string; password: string; user: User }> = [
      {
        email: 'admin@roadsfund.go.tz',
        password: 'Admin@123456',
        user: {
          id: '1',
          email: 'admin@roadsfund.go.tz',
          firstName: 'System',
          lastName: 'Administrator',
          role: UserRole.SYSTEM_ADMINISTRATOR,
          organization: 'Roads Fund Board',
          phone: '+255712345678',
          createdAt: new Date(),
          lastLogin: new Date()
        }
      },
      {
        email: 'john.mwangi@email.com',
        password: 'Test@123456',
        user: {
          id: '2',
          email: 'john.mwangi@email.com',
          firstName: 'John',
          lastName: 'Mwangi',
          role: UserRole.PUBLIC_APPLICANT,
          organization: 'Public Applicant',
          phone: '+255723456789',
          createdAt: new Date(),
          lastLogin: new Date()
        }
      },
      {
        email: 'ras.dar@roadsfund.go.tz',
        password: 'Ras@123456',
        user: {
          id: '3',
          email: 'ras.dar@roadsfund.go.tz',
          firstName: 'RAS',
          lastName: 'Dar es Salaam',
          role: UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY,
          organization: 'Regional Administration',
          region: 'Dar es Salaam',
          phone: '+255734567890',
          createdAt: new Date(),
          lastLogin: new Date()
        }
      },
      {
        email: 'chair@nrcc.go.tz',
        password: 'Chair@123456',
        user: {
          id: '4',
          email: 'chair@nrcc.go.tz',
          firstName: 'NRCC',
          lastName: 'Chairperson',
          role: UserRole.NRCC_CHAIRPERSON,
          organization: 'NRCC',
          phone: '+255767890123',
          createdAt: new Date(),
          lastLogin: new Date()
        }
      }
    ];

    const mockUser = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    const token = 'mock_dev_token_' + Math.random().toString(36).substring(2, 15);
    this.setCurrentUser(mockUser.user, token);

    return {
      user: mockUser.user,
      token,
      expiresIn: 3600
    };
  }

  logout(): void {
    const token = localStorage.getItem('authToken');

    // Call backend logout if we have a token
    if (token && !token.startsWith('mock_')) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {} // Ignore logout errors
      });
    }

    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/']);
  }

  private setCurrentUser(user: User, token: string, refreshToken?: string): void {
    console.log('💾 Storing user and token in localStorage');
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    console.log('✅ Token stored. Verify with: localStorage.getItem("authToken")');
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.logout();
      }
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<{ accessToken: string }>>(`${this.apiUrl}/refresh-token`, {
          refreshToken
        })
      );

      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }

    return null;
  }

  // Get current user profile from backend
  async fetchCurrentUserProfile(): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<any>>(`${this.apiUrl}/me`)
      );

      if (response.success && response.data) {
        const userData = response.data;
        const user: User = {
          id: userData.id.toString(),
          email: userData.email,
          firstName: userData.name.split(' ')[0] || userData.name,
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          role: this.mapBackendRole(userData.role),
          phone: userData.phoneNumber,
          organization: this.getOrganizationFromRole(userData.role),
          createdAt: new Date(userData.createdAt),
          lastLogin: new Date()
        };

        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }

    return null;
  }

  // Get the current auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.currentUserSignal()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  isApplicant(): boolean {
    return this.hasAnyRole([UserRole.PUBLIC_APPLICANT, UserRole.MEMBER_OF_PARLIAMENT]);
  }

  isReviewer(): boolean {
    return this.hasAnyRole([
      UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY,
      UserRole.REGIONAL_COMMISSIONER,
      UserRole.MINISTER_OF_WORKS,
      UserRole.NRCC_CHAIRPERSON,
      UserRole.NRCC_MEMBER,
      UserRole.NRCC_SECRETARIAT,
      UserRole.MINISTRY_LAWYER
    ]);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.SYSTEM_ADMINISTRATOR);
  }

  getDashboardRoute(): string {
    const user = this.currentUserSignal();
    if (!user) return '/';

    switch (user.role) {
      case UserRole.PUBLIC_APPLICANT:
      case UserRole.MEMBER_OF_PARLIAMENT:
        return '/applicant/dashboard';
      case UserRole.REGIONAL_ADMINISTRATIVE_SECRETARY:
      case UserRole.REGIONAL_COMMISSIONER:
      case UserRole.REGIONAL_ROADS_BOARD_INITIATOR:
        return '/reviewer/regional/dashboard';
      case UserRole.MINISTER_OF_WORKS:
        return '/reviewer/national/dashboard';
      case UserRole.NRCC_CHAIRPERSON:
      case UserRole.NRCC_MEMBER:
      case UserRole.NRCC_SECRETARIAT:
        return '/nrcc/dashboard';
      case UserRole.MINISTRY_LAWYER:
        return '/reviewer/national/dashboard';
      case UserRole.SYSTEM_ADMINISTRATOR:
        return '/admin/dashboard';
      default:
        return '/';
    }
  }
}
