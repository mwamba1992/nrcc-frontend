import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Road,
  RoadResponse,
  CreateRoadRequest,
  UpdateRoadRequest
} from '../models/road.model';
import { ApiResponse, PageResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RoadService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roads`;

  getAllRoads(): Observable<ApiResponse<RoadResponse[]>> {
    return this.http.get<ApiResponse<RoadResponse[]>>(this.apiUrl);
  }

  getRoadById(id: number): Observable<ApiResponse<RoadResponse>> {
    return this.http.get<ApiResponse<RoadResponse>>(`${this.apiUrl}/${id}`);
  }

  getRoadByNumber(roadNumber: string): Observable<ApiResponse<RoadResponse>> {
    return this.http.get<ApiResponse<RoadResponse>>(`${this.apiUrl}/number/${roadNumber}`);
  }

  getRoadsPaginated(page: number = 0, size: number = 10): Observable<ApiResponse<PageResponse<RoadResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<RoadResponse>>>(`${this.apiUrl}/paginated`, { params });
  }

  getRoadsByRegion(region: string): Observable<ApiResponse<RoadResponse[]>> {
    return this.http.get<ApiResponse<RoadResponse[]>>(`${this.apiUrl}/region/${region}`);
  }

  getRoadsByDistrict(district: string): Observable<ApiResponse<RoadResponse[]>> {
    return this.http.get<ApiResponse<RoadResponse[]>>(`${this.apiUrl}/district/${district}`);
  }

  getRoadsByStatus(status: string): Observable<ApiResponse<RoadResponse[]>> {
    return this.http.get<ApiResponse<RoadResponse[]>>(`${this.apiUrl}/status/${status}`);
  }

  createRoad(request: CreateRoadRequest): Observable<ApiResponse<RoadResponse>> {
    return this.http.post<ApiResponse<RoadResponse>>(this.apiUrl, request);
  }

  updateRoad(id: number, request: UpdateRoadRequest): Observable<ApiResponse<RoadResponse>> {
    return this.http.put<ApiResponse<RoadResponse>>(`${this.apiUrl}/${id}`, request);
  }

  deleteRoad(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  activateRoad(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateRoad(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
