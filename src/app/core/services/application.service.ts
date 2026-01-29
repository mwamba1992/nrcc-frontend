import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApplicationResponse,
  ApplicationDetailResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  WorkflowActionRequest,
  AssignVerificationRequest,
  SubmitVerificationReportRequest,
  MinisterDecisionRequest,
  UpdateGazettementRequest,
  SubmitAppealRequest
} from '../models/application.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  // ==================== GET OPERATIONS ====================

  /**
   * Get all applications (paginated)
   */
  getAllApplications(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC'
  ): Observable<ApiResponse<PageResponse<ApplicationResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<ApplicationResponse>>>(this.apiUrl, { params });
  }

  /**
   * Get application by ID
   */
  getApplicationById(id: number): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.get<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get application by application number
   */
  getApplicationByNumber(applicationNumber: string): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.get<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/number/${applicationNumber}`);
  }

  /**
   * Get applications by status (paginated)
   */
  getApplicationsByStatus(
    status: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC'
  ): Observable<ApiResponse<PageResponse<ApplicationResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<ApplicationResponse>>>(`${this.apiUrl}/status/${status}`, { params });
  }

  /**
   * Get current user's applications (paginated)
   */
  getMyApplications(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC'
  ): Observable<ApiResponse<PageResponse<ApplicationResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    return this.http.get<ApiResponse<PageResponse<ApplicationResponse>>>(`${this.apiUrl}/my-applications`, { params });
  }

  /**
   * Get applications assigned to current user for verification
   */
  getMyAssignedApplications(): Observable<ApiResponse<ApplicationResponse[]>> {
    return this.http.get<ApiResponse<ApplicationResponse[]>>(`${this.apiUrl}/my-assignments`);
  }

  // ==================== CRUD OPERATIONS ====================

  /**
   * Create a new application (as draft)
   */
  createApplication(request: CreateApplicationRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(this.apiUrl, request);
  }

  /**
   * Update an existing application (draft only)
   */
  updateApplication(id: number, request: UpdateApplicationRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.put<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete an application (draft only)
   */
  deleteApplication(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // ==================== WORKFLOW ACTIONS ====================

  /**
   * Submit application for review
   * Workflow A (Individual/MP): DRAFT -> SUBMITTED -> UNDER_MINISTER_REVIEW
   * Workflow B (RRB): DRAFT -> SUBMITTED -> UNDER_RAS_REVIEW
   */
  submitApplication(id: number): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/submit`, {});
  }

  /**
   * RAS approves application (Workflow B)
   * UNDER_RAS_REVIEW -> UNDER_RC_REVIEW
   */
  rasApprove(id: number, request: WorkflowActionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/ras-approve`, request);
  }

  /**
   * RC approves application (Workflow B)
   * UNDER_RC_REVIEW -> UNDER_MINISTER_REVIEW
   */
  rcApprove(id: number, request: WorkflowActionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/rc-approve`, request);
  }

  /**
   * Minister forwards to NRCC Chair (Workflow C)
   * UNDER_MINISTER_REVIEW -> WITH_NRCC_CHAIR
   */
  forwardToNrccChair(id: number, request: WorkflowActionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/forward-to-nrcc`, request);
  }

  /**
   * NRCC Chair assigns verification to member
   * WITH_NRCC_CHAIR -> VERIFICATION_IN_PROGRESS
   */
  assignVerification(id: number, request: AssignVerificationRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/assign-verification`, request);
  }

  /**
   * NRCC Member submits verification report
   * VERIFICATION_IN_PROGRESS -> NRCC_REVIEW_MEETING
   */
  submitVerificationReport(id: number, request: SubmitVerificationReportRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/submit-verification-report`, request);
  }

  /**
   * NRCC Chair submits recommendation to Minister
   * NRCC_REVIEW_MEETING -> RECOMMENDATION_SUBMITTED
   */
  submitRecommendation(id: number, request: WorkflowActionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/submit-recommendation`, request);
  }

  /**
   * Minister records final decision
   * RECOMMENDATION_SUBMITTED -> APPROVED / DISAPPROVED_REFUSED / DISAPPROVED_DESIGNATED
   */
  recordMinisterDecision(id: number, request: MinisterDecisionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/decision`, request);
  }

  /**
   * Ministry Lawyer updates gazettement details
   * APPROVED -> PENDING_GAZETTEMENT -> GAZETTED
   */
  updateGazettement(id: number, request: UpdateGazettementRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/gazette`, request);
  }

  /**
   * Return application for correction (any reviewer can do this)
   * Any status -> RETURNED_FOR_CORRECTION
   */
  returnForCorrection(id: number, request: WorkflowActionRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/return`, request);
  }

  /**
   * Applicant submits appeal after disapproval
   * DISAPPROVED_REFUSED / DISAPPROVED_DESIGNATED -> APPEAL_SUBMITTED
   */
  submitAppeal(id: number, request: SubmitAppealRequest): Observable<ApiResponse<ApplicationDetailResponse>> {
    return this.http.post<ApiResponse<ApplicationDetailResponse>>(`${this.apiUrl}/${id}/appeal`, request);
  }
}
