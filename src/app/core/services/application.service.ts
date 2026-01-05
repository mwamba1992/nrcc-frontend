import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Application, CreateApplicationDto, ApplicationStatus } from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  /**
   * Get all applications for the current user
   */
  getMyApplications(): Observable<Application[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Application[]>(`${this.apiUrl}/my-applications`);

    // Mock data for now
    return of([]);
  }

  /**
   * Get a single application by ID
   */
  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new application
   */
  createApplication(application: CreateApplicationDto): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  /**
   * Update an existing application
   */
  updateApplication(id: string, application: Partial<Application>): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, application);
  }

  /**
   * Delete an application
   */
  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get applications by status
   */
  getApplicationsByStatus(status: ApplicationStatus): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Submit application for review
   */
  submitForReview(id: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${id}/submit`, {});
  }

  /**
   * Upload document for application
   */
  uploadDocument(applicationId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${applicationId}/documents`, formData);
  }

  /**
   * Delete document from application
   */
  deleteDocument(applicationId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/documents/${documentId}`);
  }
}
