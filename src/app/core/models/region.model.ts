export interface Region {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: RegionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum RegionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface CreateRegionRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRegionRequest {
  code?: string;
  name?: string;
  description?: string;
  status?: RegionStatus;
}

export interface RegionResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: string;
  districtCount?: number;
}
