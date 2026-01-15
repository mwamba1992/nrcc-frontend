import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  Region,
  RegionResponse,
  CreateRegionRequest,
  UpdateRegionRequest,
  RegionStatus
} from '../models/region.model';
import { ApiResponse } from '../models/api-response.model';

// Mock data for regions in Tanzania
const MOCK_REGIONS: RegionResponse[] = [
  { id: 1, code: 'DSM', name: 'Dar es Salaam', description: 'Commercial capital', status: 'ACTIVE', districtCount: 5 },
  { id: 2, code: 'ARU', name: 'Arusha', description: 'Northern region', status: 'ACTIVE', districtCount: 7 },
  { id: 3, code: 'KIL', name: 'Kilimanjaro', description: 'Home of Mount Kilimanjaro', status: 'ACTIVE', districtCount: 7 },
  { id: 4, code: 'MWZ', name: 'Mwanza', description: 'Lake Victoria region', status: 'ACTIVE', districtCount: 7 },
  { id: 5, code: 'DOD', name: 'Dodoma', description: 'National capital', status: 'ACTIVE', districtCount: 7 },
  { id: 6, code: 'MOR', name: 'Morogoro', description: 'Central region', status: 'ACTIVE', districtCount: 7 },
  { id: 7, code: 'TAN', name: 'Tanga', description: 'Coastal region', status: 'ACTIVE', districtCount: 11 },
  { id: 8, code: 'MBY', name: 'Mbeya', description: 'Southern highlands', status: 'ACTIVE', districtCount: 7 },
  { id: 9, code: 'IRN', name: 'Iringa', description: 'Southern highlands', status: 'ACTIVE', districtCount: 5 },
  { id: 10, code: 'PWN', name: 'Pwani (Coast)', description: 'Coast region', status: 'ACTIVE', districtCount: 8 }
];

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  // TODO: Replace with real HTTP calls when backend endpoints are available
  // private http = inject(HttpClient);
  // private apiUrl = `${environment.apiUrl}/regions`;

  private regionsSignal = signal<RegionResponse[]>([...MOCK_REGIONS]);
  private nextId = MOCK_REGIONS.length + 1;

  getAllRegions(): Observable<ApiResponse<RegionResponse[]>> {
    return of({
      success: true,
      message: 'Regions retrieved successfully',
      data: this.regionsSignal()
    }).pipe(delay(300));
  }

  getRegionById(id: number): Observable<ApiResponse<RegionResponse>> {
    const region = this.regionsSignal().find(r => r.id === id);
    if (!region) {
      return throwError(() => new Error('Region not found')).pipe(delay(300));
    }
    return of({
      success: true,
      message: 'Region retrieved successfully',
      data: region
    }).pipe(delay(300));
  }

  getActiveRegions(): Observable<ApiResponse<RegionResponse[]>> {
    return of({
      success: true,
      message: 'Active regions retrieved successfully',
      data: this.regionsSignal().filter(r => r.status === 'ACTIVE')
    }).pipe(delay(300));
  }

  createRegion(request: CreateRegionRequest): Observable<ApiResponse<RegionResponse>> {
    const newRegion: RegionResponse = {
      id: this.nextId++,
      code: request.code,
      name: request.name,
      description: request.description,
      status: 'ACTIVE',
      districtCount: 0
    };

    this.regionsSignal.update(regions => [...regions, newRegion]);

    return of({
      success: true,
      message: 'Region created successfully',
      data: newRegion
    }).pipe(delay(500));
  }

  updateRegion(id: number, request: UpdateRegionRequest): Observable<ApiResponse<RegionResponse>> {
    const regions = this.regionsSignal();
    const index = regions.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Region not found')).pipe(delay(300));
    }

    const updatedRegion = {
      ...regions[index],
      ...request
    };

    this.regionsSignal.update(regions => {
      const newRegions = [...regions];
      newRegions[index] = updatedRegion;
      return newRegions;
    });

    return of({
      success: true,
      message: 'Region updated successfully',
      data: updatedRegion
    }).pipe(delay(500));
  }

  deleteRegion(id: number): Observable<ApiResponse<void>> {
    this.regionsSignal.update(regions => regions.filter(r => r.id !== id));

    return of({
      success: true,
      message: 'Region deleted successfully',
      data: undefined as any
    }).pipe(delay(500));
  }

  activateRegion(id: number): Observable<ApiResponse<void>> {
    this.regionsSignal.update(regions =>
      regions.map(r => r.id === id ? { ...r, status: 'ACTIVE' } : r)
    );

    return of({
      success: true,
      message: 'Region activated successfully',
      data: undefined as any
    }).pipe(delay(500));
  }

  deactivateRegion(id: number): Observable<ApiResponse<void>> {
    this.regionsSignal.update(regions =>
      regions.map(r => r.id === id ? { ...r, status: 'INACTIVE' } : r)
    );

    return of({
      success: true,
      message: 'Region deactivated successfully',
      data: undefined as any
    }).pipe(delay(500));
  }
}
