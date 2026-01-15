import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  District,
  DistrictResponse,
  CreateDistrictRequest,
  UpdateDistrictRequest,
  DistrictStatus
} from '../models/district.model';
import { ApiResponse } from '../models/api-response.model';

// Mock data for districts in Tanzania
const MOCK_DISTRICTS: DistrictResponse[] = [
  // Dar es Salaam districts (regionId: 1)
  { id: 1, code: 'KIN', name: 'Kinondoni', regionId: 1, regionName: 'Dar es Salaam', status: 'ACTIVE' },
  { id: 2, code: 'ILA', name: 'Ilala', regionId: 1, regionName: 'Dar es Salaam', status: 'ACTIVE' },
  { id: 3, code: 'TEM', name: 'Temeke', regionId: 1, regionName: 'Dar es Salaam', status: 'ACTIVE' },
  { id: 4, code: 'UBU', name: 'Ubungo', regionId: 1, regionName: 'Dar es Salaam', status: 'ACTIVE' },
  { id: 5, code: 'KIG', name: 'Kigamboni', regionId: 1, regionName: 'Dar es Salaam', status: 'ACTIVE' },

  // Arusha districts (regionId: 2)
  { id: 6, code: 'ARU-M', name: 'Arusha Municipal', regionId: 2, regionName: 'Arusha', status: 'ACTIVE' },
  { id: 7, code: 'KAR', name: 'Karatu', regionId: 2, regionName: 'Arusha', status: 'ACTIVE' },
  { id: 8, code: 'MER', name: 'Meru', regionId: 2, regionName: 'Arusha', status: 'ACTIVE' },
  { id: 9, code: 'MON', name: 'Monduli', regionId: 2, regionName: 'Arusha', status: 'ACTIVE' },
  { id: 10, code: 'NGO', name: 'Ngorongoro', regionId: 2, regionName: 'Arusha', status: 'ACTIVE' },

  // Kilimanjaro districts (regionId: 3)
  { id: 11, code: 'HAI', name: 'Hai', regionId: 3, regionName: 'Kilimanjaro', status: 'ACTIVE' },
  { id: 12, code: 'MOS', name: 'Moshi Municipal', regionId: 3, regionName: 'Kilimanjaro', status: 'ACTIVE' },
  { id: 13, code: 'ROM', name: 'Rombo', regionId: 3, regionName: 'Kilimanjaro', status: 'ACTIVE' },
  { id: 14, code: 'SIM', name: 'Simiyu', regionId: 3, regionName: 'Kilimanjaro', status: 'ACTIVE' },

  // Dodoma districts (regionId: 5)
  { id: 15, code: 'DOD-M', name: 'Dodoma Municipal', regionId: 5, regionName: 'Dodoma', status: 'ACTIVE' },
  { id: 16, code: 'KON', name: 'Kondoa', regionId: 5, regionName: 'Dodoma', status: 'ACTIVE' },
  { id: 17, code: 'MPW', name: 'Mpwapwa', regionId: 5, regionName: 'Dodoma', status: 'ACTIVE' }
];

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  // TODO: Replace with real HTTP calls when backend endpoints are available
  // private http = inject(HttpClient);
  // private apiUrl = `${environment.apiUrl}/districts`;

  private districtsSignal = signal<DistrictResponse[]>([...MOCK_DISTRICTS]);
  private nextId = MOCK_DISTRICTS.length + 1;

  getAllDistricts(): Observable<ApiResponse<DistrictResponse[]>> {
    return of({
      success: true,
      message: 'Districts retrieved successfully',
      data: this.districtsSignal()
    }).pipe(delay(300));
  }

  getDistrictById(id: number): Observable<ApiResponse<DistrictResponse>> {
    const district = this.districtsSignal().find(d => d.id === id);
    if (!district) {
      return throwError(() => new Error('District not found')).pipe(delay(300));
    }
    return of({
      success: true,
      message: 'District retrieved successfully',
      data: district
    }).pipe(delay(300));
  }

  getDistrictsByRegion(regionId: number): Observable<ApiResponse<DistrictResponse[]>> {
    return of({
      success: true,
      message: 'Districts retrieved successfully',
      data: this.districtsSignal().filter(d => d.regionId === regionId)
    }).pipe(delay(300));
  }

  getActiveDistricts(): Observable<ApiResponse<DistrictResponse[]>> {
    return of({
      success: true,
      message: 'Active districts retrieved successfully',
      data: this.districtsSignal().filter(d => d.status === 'ACTIVE')
    }).pipe(delay(300));
  }

  createDistrict(request: CreateDistrictRequest): Observable<ApiResponse<DistrictResponse>> {
    // In a real implementation, we'd fetch the region name from the region service
    const newDistrict: DistrictResponse = {
      id: this.nextId++,
      code: request.code,
      name: request.name,
      regionId: request.regionId,
      regionName: 'Region Name', // TODO: Fetch from region service
      description: request.description,
      status: 'ACTIVE'
    };

    this.districtsSignal.update(districts => [...districts, newDistrict]);

    return of({
      success: true,
      message: 'District created successfully',
      data: newDistrict
    }).pipe(delay(500));
  }

  updateDistrict(id: number, request: UpdateDistrictRequest): Observable<ApiResponse<DistrictResponse>> {
    const districts = this.districtsSignal();
    const index = districts.findIndex(d => d.id === id);

    if (index === -1) {
      return throwError(() => new Error('District not found')).pipe(delay(300));
    }

    const updatedDistrict = {
      ...districts[index],
      ...request
    };

    this.districtsSignal.update(districts => {
      const newDistricts = [...districts];
      newDistricts[index] = updatedDistrict;
      return newDistricts;
    });

    return of({
      success: true,
      message: 'District updated successfully',
      data: updatedDistrict
    }).pipe(delay(500));
  }

  deleteDistrict(id: number): Observable<ApiResponse<void>> {
    this.districtsSignal.update(districts => districts.filter(d => d.id !== id));

    return of({
      success: true,
      message: 'District deleted successfully',
      data: undefined as any
    }).pipe(delay(500));
  }

  activateDistrict(id: number): Observable<ApiResponse<void>> {
    this.districtsSignal.update(districts =>
      districts.map(d => d.id === id ? { ...d, status: 'ACTIVE' } : d)
    );

    return of({
      success: true,
      message: 'District activated successfully',
      data: undefined as any
    }).pipe(delay(500));
  }

  deactivateDistrict(id: number): Observable<ApiResponse<void>> {
    this.districtsSignal.update(districts =>
      districts.map(d => d.id === id ? { ...d, status: 'INACTIVE' } : d)
    );

    return of({
      success: true,
      message: 'District deactivated successfully',
      data: undefined as any
    }).pipe(delay(500));
  }
}
