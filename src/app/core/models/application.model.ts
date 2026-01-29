// Application status enum matching API (18 workflow statuses)
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RETURNED_FOR_CORRECTION = 'RETURNED_FOR_CORRECTION',
  UNDER_RAS_REVIEW = 'UNDER_RAS_REVIEW',
  UNDER_RC_REVIEW = 'UNDER_RC_REVIEW',
  UNDER_MINISTER_REVIEW = 'UNDER_MINISTER_REVIEW',
  WITH_NRCC_CHAIR = 'WITH_NRCC_CHAIR',
  VERIFICATION_IN_PROGRESS = 'VERIFICATION_IN_PROGRESS',
  NRCC_REVIEW_MEETING = 'NRCC_REVIEW_MEETING',
  RECOMMENDATION_SUBMITTED = 'RECOMMENDATION_SUBMITTED',
  APPROVED = 'APPROVED',
  DISAPPROVED_REFUSED = 'DISAPPROVED_REFUSED',
  DISAPPROVED_DESIGNATED = 'DISAPPROVED_DESIGNATED',
  PENDING_GAZETTEMENT = 'PENDING_GAZETTEMENT',
  GAZETTED = 'GAZETTED',
  APPEAL_SUBMITTED = 'APPEAL_SUBMITTED',
  APPEAL_UNDER_REVIEW = 'APPEAL_UNDER_REVIEW',
  APPEAL_CLOSED = 'APPEAL_CLOSED',
  // Legacy statuses for backward compatibility
  PENDING = 'DRAFT',
  UNDER_REVIEW = 'UNDER_MINISTER_REVIEW',
  REJECTED = 'DISAPPROVED_REFUSED',
  REQUIRES_CHANGES = 'RETURNED_FOR_CORRECTION'
}

// Status display names for UI
export const ApplicationStatusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  RETURNED_FOR_CORRECTION: 'Returned for Correction',
  UNDER_RAS_REVIEW: 'Under RAS Review',
  UNDER_RC_REVIEW: 'Under RC Review',
  UNDER_MINISTER_REVIEW: 'Under Minister Review',
  WITH_NRCC_CHAIR: 'With NRCC Chair',
  VERIFICATION_IN_PROGRESS: 'Verification in Progress',
  NRCC_REVIEW_MEETING: 'NRCC Review Meeting',
  RECOMMENDATION_SUBMITTED: 'Recommendation Submitted',
  APPROVED: 'Approved',
  DISAPPROVED_REFUSED: 'Disapproved - Refused',
  DISAPPROVED_DESIGNATED: 'Disapproved - Designated',
  PENDING_GAZETTEMENT: 'Pending Gazettement',
  GAZETTED: 'Gazetted',
  APPEAL_SUBMITTED: 'Appeal Submitted',
  APPEAL_UNDER_REVIEW: 'Appeal Under Review',
  APPEAL_CLOSED: 'Appeal Closed'
};

// Status colors for UI badges
export const ApplicationStatusColors: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: '#f1f5f9', text: '#475569' },
  SUBMITTED: { bg: '#dbeafe', text: '#1d4ed8' },
  RETURNED_FOR_CORRECTION: { bg: '#fef3c7', text: '#b45309' },
  UNDER_RAS_REVIEW: { bg: '#e0e7ff', text: '#4338ca' },
  UNDER_RC_REVIEW: { bg: '#e0e7ff', text: '#4338ca' },
  UNDER_MINISTER_REVIEW: { bg: '#fae8ff', text: '#a21caf' },
  WITH_NRCC_CHAIR: { bg: '#ccfbf1', text: '#0f766e' },
  VERIFICATION_IN_PROGRESS: { bg: '#fed7aa', text: '#c2410c' },
  NRCC_REVIEW_MEETING: { bg: '#bfdbfe', text: '#1e40af' },
  RECOMMENDATION_SUBMITTED: { bg: '#a5f3fc', text: '#0e7490' },
  APPROVED: { bg: '#dcfce7', text: '#15803d' },
  DISAPPROVED_REFUSED: { bg: '#fee2e2', text: '#b91c1c' },
  DISAPPROVED_DESIGNATED: { bg: '#fecaca', text: '#dc2626' },
  PENDING_GAZETTEMENT: { bg: '#fef9c3', text: '#a16207' },
  GAZETTED: { bg: '#bbf7d0', text: '#166534' },
  APPEAL_SUBMITTED: { bg: '#fecdd3', text: '#be123c' },
  APPEAL_UNDER_REVIEW: { bg: '#fbcfe8', text: '#be185d' },
  APPEAL_CLOSED: { bg: '#e5e7eb', text: '#374151' }
};

// Applicant types
export enum ApplicantType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  MEMBER_OF_PARLIAMENT = 'MEMBER_OF_PARLIAMENT',
  REGIONAL_ROADS_BOARD = 'REGIONAL_ROADS_BOARD'
}

export const ApplicantTypeLabels: Record<string, string> = {
  INDIVIDUAL: 'Individual',
  GROUP: 'Group',
  MEMBER_OF_PARLIAMENT: 'Member of Parliament',
  REGIONAL_ROADS_BOARD: 'Regional Roads Board'
};

// Road classification
export enum RoadClass {
  DISTRICT = 'DISTRICT',
  REGIONAL = 'REGIONAL',
  TRUNK = 'TRUNK'
}

export const RoadClassLabels: Record<string, string> = {
  DISTRICT: 'District Road',
  REGIONAL: 'Regional Road',
  TRUNK: 'Trunk Road'
};

// Minister decision types
export enum MinisterDecision {
  APPROVE = 'APPROVE',
  DISAPPROVE = 'DISAPPROVE'
}

export enum DisapprovalType {
  REFUSED = 'REFUSED',
  DESIGNATED = 'DESIGNATED'
}

// Verification status
export enum VerificationStatus {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// ==================== REQUEST INTERFACES ====================

// Eligibility criterion request
export interface EligibilityCriterionRequest {
  criterionCode: string;
  details?: string;
  evidenceDescription?: string;
}

// Create application request
export interface CreateApplicationRequest {
  applicantType: string;
  proposedClass: string;
  roadName: string;
  roadLength: number;
  currentClass: string;
  startingPoint: string;
  terminalPoint: string;
  reclassificationReasons: string;
  surfaceTypeCarriageway: string;
  surfaceTypeShoulders?: string;
  carriagewayWidth: number;
  formationWidth: number;
  actualRoadReserveWidth: number;
  trafficLevel: string;
  trafficComposition: string;
  townsVillagesLinked: string;
  principalNodes?: string;
  busRoutes: string;
  publicServices: string;
  alternativeRoutes?: string;
  eligibilityCriteria: EligibilityCriterionRequest[];
}

// Update application request
export interface UpdateApplicationRequest {
  proposedClass?: string;
  roadName?: string;
  roadLength?: number;
  currentClass?: string;
  startingPoint?: string;
  terminalPoint?: string;
  reclassificationReasons?: string;
  surfaceTypeCarriageway?: string;
  surfaceTypeShoulders?: string;
  carriagewayWidth?: number;
  formationWidth?: number;
  actualRoadReserveWidth?: number;
  trafficLevel?: string;
  trafficComposition?: string;
  townsVillagesLinked?: string;
  principalNodes?: string;
  busRoutes?: string;
  publicServices?: string;
  alternativeRoutes?: string;
  eligibilityCriteria?: EligibilityCriterionRequest[];
}

// Workflow action request (for RAS/RC approve, return, recommendation)
export interface WorkflowActionRequest {
  comments: string;
}

// Assign verification request
export interface AssignVerificationRequest {
  memberId: number;
  dueDate: string; // ISO date
  visitDate?: string; // ISO date
  instructions?: string;
}

// Submit verification report request
export interface SubmitVerificationReportRequest {
  assignmentId: number;
  visitDate: string; // ISO date
  findings: string;
}

// Minister decision request
export interface MinisterDecisionRequest {
  decision: 'APPROVE' | 'DISAPPROVE';
  disapprovalType?: 'REFUSED' | 'DESIGNATED';
  reason?: string;
}

// Update gazettement request
export interface UpdateGazettementRequest {
  gazetteNumber: string;
  gazetteDate: string; // ISO date
}

// Submit appeal request
export interface SubmitAppealRequest {
  grounds: string;
}

// ==================== RESPONSE INTERFACES ====================

// Form data response
export interface FormDataResponse {
  roadName: string;
  roadLength: number;
  currentClass: string;
  proposedClass: string;
  startingPoint: string;
  terminalPoint: string;
  reclassificationReasons: string;
  surfaceTypeCarriageway: string;
  surfaceTypeShoulders?: string;
  carriagewayWidth: number;
  formationWidth: number;
  actualRoadReserveWidth: number;
  trafficLevel: string;
  trafficComposition: string;
  townsVillagesLinked: string;
  principalNodes?: string;
  busRoutes: string;
  publicServices: string;
  alternativeRoutes?: string;
}

// Eligibility criterion response
export interface EligibilityCriterionResponse {
  code: string;
  description: string;
  details?: string;
  evidenceDescription?: string;
}

// Approval action response (history)
export interface ApprovalActionResponse {
  id: number;
  action: string;
  fromStatus: string;
  toStatus: string;
  actorName: string;
  actorRole: string;
  comments?: string;
  actionDate: string;
}

// Verification report response
export interface VerificationReportResponse {
  id: number;
  findings: string;
  visitDate: string;
  submittedAt: string;
}

// Verification assignment response
export interface VerificationAssignmentResponse {
  id: number;
  memberName: string;
  assignedByName: string;
  dueDate: string;
  visitDate?: string;
  status: string;
  instructions?: string;
  report?: VerificationReportResponse;
}

// Recommendation response
export interface RecommendationResponse {
  id: number;
  recommendationText: string;
  submittedByName: string;
  submittedDate: string;
}

// Minister decision response
export interface MinisterDecisionResponse {
  id: number;
  decision: string;
  disapprovalType?: string;
  reason?: string;
  decidedByName: string;
  decisionDate: string;
}

// Gazettement response
export interface GazettementResponse {
  id: number;
  gazetteNumber: string;
  gazetteDate: string;
  status: string;
  updatedByName: string;
}

// Appeal response
export interface AppealResponse {
  id: number;
  grounds: string;
  status: string;
  decision?: string;
  appealDate: string;
  decisionDate?: string;
}

// Application list response (summary)
export interface ApplicationResponse {
  id: number;
  applicationNumber: string;
  applicantType: string;
  applicantName: string;
  applicantEmail?: string;
  roadName: string;
  currentClass: string;
  proposedClass: string;
  status: string;
  statusDisplayName: string;
  currentOwnerName?: string;
  submissionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Application detail response (full)
export interface ApplicationDetailResponse {
  id: number;
  applicationNumber: string;
  applicantType: string;
  applicantTypeDisplayName: string;
  applicantId: number;
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  status: string;
  statusDisplayName: string;
  currentOwnerId?: number;
  currentOwnerName?: string;
  currentOwnerRole?: string;
  submissionDate?: string;
  decisionDate?: string;
  createdAt: string;
  updatedAt: string;
  formData: FormDataResponse;
  eligibilityCriteria: EligibilityCriterionResponse[];
  approvalHistory: ApprovalActionResponse[];
  verificationAssignments: VerificationAssignmentResponse[];
  recommendation?: RecommendationResponse;
  ministerDecision?: MinisterDecisionResponse;
  gazettement?: GazettementResponse;
  appeal?: AppealResponse;
  remarks?: string;
}

// ==================== LEGACY INTERFACES (Backward Compatibility) ====================

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
