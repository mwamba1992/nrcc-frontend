export interface District {
  id: number;
  code: string;
  name: string;
  regionId: number;
  regionName?: string;
  description?: string;
  status: DistrictStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DistrictStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface CreateDistrictRequest {
  code: string;
  name: string;
  regionId: number;
  description?: string;
}

export interface UpdateDistrictRequest {
  code?: string;
  name?: string;
  regionId?: number;
  description?: string;
  status?: DistrictStatus;
}

export interface DistrictResponse {
  id: number;
  code: string;
  name: string;
  regionId: number;
  regionName?: string;
  description?: string;
  status: string;
}
