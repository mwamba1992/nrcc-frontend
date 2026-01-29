import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserResponse,
  UserDetailsResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchRequest,
  BulkUserActionRequest,
  BulkActionResponse,
  ChangePasswordRequest
} from '../models/user.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  // ==================== GET OPERATIONS ====================

  /**
   * Get all users (non-paginated)
   */
  getAllUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(this.apiUrl);
  }

  /**
   * Get users with pagination
   */
  getUsersPaginated(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDirection: string = 'ASC'
  ): Observable<ApiResponse<PageResponse<UserResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<UserResponse>>>(`${this.apiUrl}/paginated`, { params });
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<ApiResponse<UserDetailsResponse>> {
    return this.http.get<ApiResponse<UserDetailsResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): Observable<ApiResponse<UserDetailsResponse>> {
    return this.http.get<ApiResponse<UserDetailsResponse>>(`${this.apiUrl}/email/${encodeURIComponent(email)}`);
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/role/${role}`);
  }

  /**
   * Get users by status
   */
  getUsersByStatus(status: string): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Get users by region
   */
  getUsersByRegion(regionId: number): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/region/${regionId}`);
  }

  /**
   * Get users by district
   */
  getUsersByDistrict(districtId: number): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/district/${districtId}`);
  }

  // ==================== SEARCH OPERATIONS ====================

  /**
   * Search users by name (GET)
   */
  searchUsersByName(
    name: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDirection: string = 'ASC'
  ): Observable<ApiResponse<PageResponse<UserResponse>>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<UserResponse>>>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Advanced search users (POST)
   */
  searchUsers(
    searchRequest: UserSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    sortDirection: string = 'ASC'
  ): Observable<ApiResponse<PageResponse<UserResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.post<ApiResponse<PageResponse<UserResponse>>>(`${this.apiUrl}/search`, searchRequest, { params });
  }

  // ==================== CREATE/UPDATE OPERATIONS ====================

  /**
   * Create a new user
   */
  createUser(request: CreateUserRequest): Observable<ApiResponse<UserDetailsResponse>> {
    return this.http.post<ApiResponse<UserDetailsResponse>>(this.apiUrl, request);
  }

  /**
   * Update an existing user
   */
  updateUser(id: number, request: UpdateUserRequest): Observable<ApiResponse<UserDetailsResponse>> {
    return this.http.put<ApiResponse<UserDetailsResponse>>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // ==================== STATUS OPERATIONS ====================

  /**
   * Activate a user
   */
  activateUser(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/activate`, {});
  }

  /**
   * Deactivate a user
   */
  deactivateUser(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Perform bulk action on multiple users
   */
  bulkAction(request: BulkUserActionRequest): Observable<ApiResponse<BulkActionResponse>> {
    return this.http.post<ApiResponse<BulkActionResponse>>(`${this.apiUrl}/bulk`, request);
  }

  // ==================== PASSWORD OPERATIONS ====================

  /**
   * Change user password (admin)
   */
  changePassword(id: number, request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/change-password`, request);
  }

  /**
   * Send email verification
   */
  sendEmailVerification(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/send-verification`, {});
  }

  // ==================== STATISTICS ====================

  /**
   * Count users by status
   */
  countByStatus(status: string): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/stats/count-by-status/${status}`);
  }

  /**
   * Count users by role
   */
  countByRole(role: string): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/stats/count-by-role/${role}`);
  }

  /**
   * Count users by organization
   */
  countByOrganization(organizationId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/stats/count-by-organization/${organizationId}`);
  }
}
