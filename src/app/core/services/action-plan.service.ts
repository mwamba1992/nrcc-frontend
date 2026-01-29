import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ActionPlanResponse,
  ActionPlanDetailResponse,
  CreateActionPlanRequest,
  UpdateActionPlanRequest,
  TargetRequest,
  ActivityRequest,
  UpdateActivityProgressRequest
} from '../models/action-plan.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/action-plans`;

  // ==================== GET OPERATIONS ====================

  /**
   * Get all action plans (paginated)
   */
  getAllActionPlans(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC'
  ): Observable<ApiResponse<PageResponse<ActionPlanResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<ActionPlanResponse>>>(this.apiUrl, { params });
  }

  /**
   * Get action plan by ID
   */
  getActionPlanById(id: number): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.get<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get action plan by financial year
   */
  getActionPlanByYear(financialYear: string): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.get<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/year/${encodeURIComponent(financialYear)}`);
  }

  /**
   * Get action plans by status
   */
  getActionPlansByStatus(status: string): Observable<ApiResponse<ActionPlanResponse[]>> {
    return this.http.get<ApiResponse<ActionPlanResponse[]>>(`${this.apiUrl}/status/${status}`);
  }

  // ==================== CRUD OPERATIONS ====================

  /**
   * Create a new action plan
   */
  createActionPlan(request: CreateActionPlanRequest): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(this.apiUrl, request);
  }

  /**
   * Update an existing action plan
   */
  updateActionPlan(id: number, request: UpdateActionPlanRequest): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.put<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete an action plan (draft only)
   */
  deleteActionPlan(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // ==================== TARGET OPERATIONS ====================

  /**
   * Add a target to an action plan
   */
  addTarget(actionPlanId: number, request: TargetRequest): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${actionPlanId}/targets`, request);
  }

  // ==================== ACTIVITY OPERATIONS ====================

  /**
   * Add an activity to a target
   */
  addActivity(targetId: number, request: ActivityRequest): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/targets/${targetId}/activities`, request);
  }

  /**
   * Update activity progress
   */
  updateActivityProgress(activityId: number, request: UpdateActivityProgressRequest): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.patch<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/activities/${activityId}/progress`, request);
  }

  // ==================== WORKFLOW OPERATIONS ====================

  /**
   * Submit action plan for approval
   * DRAFT -> SUBMITTED
   */
  submitActionPlan(id: number): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}/submit`, {});
  }

  /**
   * Approve action plan (NRCC Chair)
   * SUBMITTED -> APPROVED
   */
  approveActionPlan(id: number, resolution?: string): Observable<ApiResponse<ActionPlanDetailResponse>> {
    let params = new HttpParams();
    if (resolution) {
      params = params.set('resolution', resolution);
    }
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}/approve`, {}, { params });
  }

  /**
   * Start action plan execution
   * APPROVED -> IN_PROGRESS
   */
  startExecution(id: number): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}/start`, {});
  }

  /**
   * Complete action plan
   * IN_PROGRESS -> COMPLETED
   */
  completePlan(id: number): Observable<ApiResponse<ActionPlanDetailResponse>> {
    return this.http.post<ApiResponse<ActionPlanDetailResponse>>(`${this.apiUrl}/${id}/complete`, {});
  }
}
