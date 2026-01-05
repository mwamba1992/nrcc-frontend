export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_CHANGES = 'REQUIRES_CHANGES'
}

export enum RoadClassification {
  DISTRICT = 'District Road',
  REGIONAL = 'Regional Road',
  TRUNK = 'Trunk Road'
}

export interface Application {
  id: string;
  referenceNumber: string;
  roadName: string;
  currentClassification: string;
  proposedClassification: string;
  roadLength: number;
  district: string;
  region: string;
  status: ApplicationStatus;
  submittedDate: Date;
  lastUpdated: Date;
  applicantId: string;
  applicantName: string;
  description?: string;
  justification?: string;
  documents?: ApplicationDocument[];
  reviews?: ApplicationReview[];
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedDate: Date;
  size: number;
}

export interface ApplicationReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerLevel: string;
  status: ApplicationStatus;
  comments: string;
  reviewDate: Date;
}

export interface CreateApplicationDto {
  roadName: string;
  currentClassification: string;
  proposedClassification: string;
  roadLength: number;
  district: string;
  region: string;
  description?: string;
  justification?: string;
}
