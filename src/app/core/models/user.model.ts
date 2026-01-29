// User roles matching the API
export enum UserRole {
  PUBLIC_APPLICANT = 'PUBLIC_APPLICANT',
  MEMBER_OF_PARLIAMENT = 'MEMBER_OF_PARLIAMENT',
  REGIONAL_ROADS_BOARD_INITIATOR = 'REGIONAL_ROADS_BOARD_INITIATOR',
  REGIONAL_ADMINISTRATIVE_SECRETARY = 'REGIONAL_ADMINISTRATIVE_SECRETARY',
  REGIONAL_COMMISSIONER = 'REGIONAL_COMMISSIONER',
  MINISTER_OF_WORKS = 'MINISTER_OF_WORKS',
  NRCC_CHAIRPERSON = 'NRCC_CHAIRPERSON',
  NRCC_MEMBER = 'NRCC_MEMBER',
  NRCC_SECRETARIAT = 'NRCC_SECRETARIAT',
  MINISTRY_LAWYER = 'MINISTRY_LAWYER',
  SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR',
  // Legacy roles for backward compatibility
  APPLICANT = 'PUBLIC_APPLICANT',
  DISTRICT_REVIEWER = 'REGIONAL_ROADS_BOARD_INITIATOR',
  REGIONAL_REVIEWER = 'REGIONAL_ADMINISTRATIVE_SECRETARY',
  NATIONAL_REVIEWER = 'NRCC_SECRETARIAT',
  ADMIN = 'SYSTEM_ADMINISTRATOR'
}

// Role display names for UI
export const UserRoleLabels: Record<string, string> = {
  PUBLIC_APPLICANT: 'Public Applicant',
  MEMBER_OF_PARLIAMENT: 'Member of Parliament',
  REGIONAL_ROADS_BOARD_INITIATOR: 'Regional Roads Board Initiator',
  REGIONAL_ADMINISTRATIVE_SECRETARY: 'Regional Administrative Secretary (RAS)',
  REGIONAL_COMMISSIONER: 'Regional Commissioner (RC)',
  MINISTER_OF_WORKS: 'Minister of Works',
  NRCC_CHAIRPERSON: 'NRCC Chairperson',
  NRCC_MEMBER: 'NRCC Member',
  NRCC_SECRETARIAT: 'NRCC Secretariat',
  MINISTRY_LAWYER: 'Ministry Lawyer',
  SYSTEM_ADMINISTRATOR: 'System Administrator'
};

// Organization response (nested in user)
export interface OrganizationResponse {
  id: number;
  code: string;
  name: string;
  organizationType?: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  region?: string;
  district?: string;
  status: string;
}

// User response from API (list view)
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  organization?: OrganizationResponse;
  district?: string;
  region?: string;
  userType?: string;
  status: string;
}

// User details response from API (detailed view)
export interface UserDetailsResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  organization?: OrganizationResponse;
  district?: string;
  region?: string;
  userType?: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

// Create user request
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: string;
  organizationId?: number;
  districtId?: number;
  userType?: string;
}

// Update user request
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  organizationId?: number;
  districtId?: number;
  userType?: string;
  status?: string;
}

// User search request
export interface UserSearchRequest {
  name?: string;
  email?: string;
  role?: string;
  organizationId?: number;
  districtId?: number;
  regionId?: number;
  status?: string;
  userType?: string;
}

// Bulk action request
export interface BulkUserActionRequest {
  userIds: number[];
  action: 'ACTIVATE' | 'DEACTIVATE' | 'DELETE';
}

// Bulk action response
export interface BulkActionResponse {
  totalRequested: number;
  successCount: number;
  failedCount: number;
  successIds: number[];
  failedItems: FailedItem[];
}

export interface FailedItem {
  userId: number;
  reason: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth related interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
  organizationId?: number;
  districtId?: number;
  userType?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
}

// Legacy User interface for backward compatibility with existing auth service
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

// Legacy LoginCredentials for backward compatibility
export interface LoginCredentials {
  email: string;
  password: string;
  userType?: 'applicant' | 'reviewer';
}

// Legacy AuthResponse for backward compatibility with existing auth service
export interface LegacyAuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
