import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Organization,
  OrganizationResponse,
  CreateOrganizationRequest,
  UpdateOrganizationRequest
} from '../models/organization.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/organizations`;

  getAllOrganizations(): Observable<ApiResponse<OrganizationResponse[]>> {
    return this.http.get<ApiResponse<OrganizationResponse[]>>(this.apiUrl);
  }

  getOrganizationById(id: number): Observable<ApiResponse<OrganizationResponse>> {
    return this.http.get<ApiResponse<OrganizationResponse>>(`${this.apiUrl}/${id}`);
  }

  getOrganizationByCode(code: string): Observable<ApiResponse<OrganizationResponse>> {
    return this.http.get<ApiResponse<OrganizationResponse>>(`${this.apiUrl}/code/${code}`);
  }

  getOrganizationsPaginated(page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<OrganizationResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<OrganizationResponse>>>(`${this.apiUrl}/paginated`, { params });
  }

  createOrganization(request: CreateOrganizationRequest): Observable<ApiResponse<OrganizationResponse>> {
    return this.http.post<ApiResponse<OrganizationResponse>>(this.apiUrl, request);
  }

  updateOrganization(id: number, request: UpdateOrganizationRequest): Observable<ApiResponse<OrganizationResponse>> {
    return this.http.put<ApiResponse<OrganizationResponse>>(`${this.apiUrl}/${id}`, request);
  }

  deleteOrganization(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  activateOrganization(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateOrganization(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
