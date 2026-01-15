export interface Organization {
  id: number;
  code: string;
  name: string;
  organizationType: string;
  description?: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address?: string;
  region?: string;
  district?: string;
  status: OrganizationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface CreateOrganizationRequest {
  code: string;
  name: string;
  organizationType: string;
  description?: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address?: string;
  districtId?: number;
}

export interface UpdateOrganizationRequest {
  code?: string;
  name?: string;
  organizationType?: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  districtId?: number;
  status?: OrganizationStatus;
}

export interface OrganizationResponse {
  id: number;
  code: string;
  name: string;
  organizationType: string;
  description?: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address?: string;
  region?: string;
  district?: string;
  status: string;
}
