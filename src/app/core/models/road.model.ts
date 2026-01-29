export interface Road {
  id: number;
  name: string;
  roadNumber?: string;
  length?: number;
  currentClass: RoadClass;
  startPoint?: string;
  endPoint?: string;
  region?: string;
  district?: string;
  surfaceType?: string;
  carriagewayWidth?: number;
  formationWidth?: number;
  roadReserveWidth?: number;
  description?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum RoadClass {
  TRUNK = 'TRUNK',
  REGIONAL = 'REGIONAL',
  DISTRICT = 'DISTRICT'
}

export interface CreateRoadRequest {
  name: string; // required
  currentClass: RoadClass; // required
  roadNumber?: string;
  length?: number;
  startPoint?: string;
  endPoint?: string;
  region?: string;
  district?: string;
  surfaceType?: string;
  carriagewayWidth?: number;
  formationWidth?: number;
  roadReserveWidth?: number;
  description?: string;
}

export interface UpdateRoadRequest {
  name?: string;
  roadNumber?: string;
  length?: number;
  currentClass?: RoadClass;
  startPoint?: string;
  endPoint?: string;
  region?: string;
  district?: string;
  surfaceType?: string;
  carriagewayWidth?: number;
  formationWidth?: number;
  roadReserveWidth?: number;
  description?: string;
  status?: string;
}

export interface RoadResponse {
  id: number;
  name: string;
  roadNumber?: string;
  length?: number;
  currentClass: string;
  startPoint?: string;
  endPoint?: string;
  region?: string;
  district?: string;
  surfaceType?: string;
  carriagewayWidth?: number;
  formationWidth?: number;
  roadReserveWidth?: number;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
