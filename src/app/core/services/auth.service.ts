import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, AuthResponse, LoginCredentials } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public readonly signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // Mock users for testing
  private mockUsers: Array<{ email: string; password: string; user: User }> = [
    // Applicants
    {
      email: 'applicant@test.com',
      password: 'password',
      user: {
        id: '1',
        email: 'applicant@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.APPLICANT,
        organization: 'Independent Applicant',
        phone: '+255 123 456 789',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    {
      email: 'mp@parliament.go.tz',
      password: 'password',
      user: {
        id: '2',
        email: 'mp@parliament.go.tz',
        firstName: 'Sarah',
        lastName: 'Mwamba',
        role: UserRole.APPLICANT,
        organization: 'Member of Parliament - Dar es Salaam',
        region: 'Dar es Salaam',
        phone: '+255 123 456 790',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    // District Reviewer
    {
      email: 'district@roadsfund.go.tz',
      password: 'password',
      user: {
        id: '3',
        email: 'district@roadsfund.go.tz',
        firstName: 'Michael',
        lastName: 'Kimaro',
        role: UserRole.DISTRICT_REVIEWER,
        organization: 'Kinondoni District Council',
        region: 'Dar es Salaam',
        district: 'Kinondoni',
        phone: '+255 123 456 791',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    // Regional Reviewer
    {
      email: 'regional@roadsfund.go.tz',
      password: 'password',
      user: {
        id: '4',
        email: 'regional@roadsfund.go.tz',
        firstName: 'Grace',
        lastName: 'Mlaki',
        role: UserRole.REGIONAL_REVIEWER,
        organization: 'Dar es Salaam Regional Roads Board',
        region: 'Dar es Salaam',
        phone: '+255 123 456 792',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    // National Reviewer
    {
      email: 'national@roadsfund.go.tz',
      password: 'password',
      user: {
        id: '5',
        email: 'national@roadsfund.go.tz',
        firstName: 'David',
        lastName: 'Ngowi',
        role: UserRole.NATIONAL_REVIEWER,
        organization: 'Roads Fund Board - National Office',
        phone: '+255 123 456 793',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    // NRCC Member
    {
      email: 'nrcc@roadsfund.go.tz',
      password: 'password',
      user: {
        id: '6',
        email: 'nrcc@roadsfund.go.tz',
        firstName: 'Peter',
        lastName: 'Mushi',
        role: UserRole.NRCC_MEMBER,
        organization: 'National Road Classification Committee',
        phone: '+255 123 456 794',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    // Admin
    {
      email: 'admin@roadsfund.go.tz',
      password: 'admin123',
      user: {
        id: '7',
        email: 'admin@roadsfund.go.tz',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        organization: 'Roads Fund Board',
        phone: '+255 123 456 795',
        createdAt: new Date(),
        lastLogin: new Date()
      }
    }
  ];

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    // User type is automatically determined from their credentials
    // No need to specify user type - the system knows based on their account

    const authResponse: AuthResponse = {
      user: { ...mockUser.user, lastLogin: new Date() },
      token: this.generateMockToken(),
      expiresIn: 3600 // 1 hour
    };

    this.setCurrentUser(authResponse.user, authResponse.token);
    return authResponse;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  private setCurrentUser(user: User, token: string): void {
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
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

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substring(2, 15);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.currentUserSignal()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  isApplicant(): boolean {
    return this.hasRole(UserRole.APPLICANT);
  }

  isReviewer(): boolean {
    return this.hasAnyRole([
      UserRole.DISTRICT_REVIEWER,
      UserRole.REGIONAL_REVIEWER,
      UserRole.NATIONAL_REVIEWER,
      UserRole.NRCC_MEMBER
    ]);
  }

  getDashboardRoute(): string {
    const user = this.currentUserSignal();
    if (!user) return '/';

    switch (user.role) {
      case UserRole.APPLICANT:
        return '/applicant/dashboard';
      case UserRole.DISTRICT_REVIEWER:
        return '/reviewer/district/dashboard';
      case UserRole.REGIONAL_REVIEWER:
        return '/reviewer/regional/dashboard';
      case UserRole.NATIONAL_REVIEWER:
        return '/reviewer/national/dashboard';
      case UserRole.NRCC_MEMBER:
        return '/nrcc/dashboard';
      case UserRole.ADMIN:
        return '/admin/dashboard';
      default:
        return '/';
    }
  }
}
