export enum UserRole {
  APPLICANT = 'applicant',
  DISTRICT_REVIEWER = 'district_reviewer',
  REGIONAL_REVIEWER = 'regional_reviewer',
  NATIONAL_REVIEWER = 'national_reviewer',
  NRCC_MEMBER = 'nrcc_member',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization?: string;
  region?: string;
  district?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType?: 'applicant' | 'reviewer';
}
