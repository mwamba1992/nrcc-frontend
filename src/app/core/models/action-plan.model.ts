// Action plan status enum
export enum ActionPlanStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// Status display names
export const ActionPlanStatusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

// Status colors for UI
export const ActionPlanStatusColors: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: '#f1f5f9', text: '#475569' },
  SUBMITTED: { bg: '#dbeafe', text: '#1d4ed8' },
  APPROVED: { bg: '#dcfce7', text: '#15803d' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#b45309' },
  COMPLETED: { bg: '#bbf7d0', text: '#166534' }
};

// Activity status enum
export enum ActivityStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export const ActivityStatusLabels: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Quarter schedule options
export const QuarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];

// ==================== REQUEST INTERFACES ====================

// Cost item request
export interface CostItemRequest {
  description: string;
  amount: number;
  fundingSource?: string;
}

// Activity request
export interface ActivityRequest {
  description: string;
  quarterSchedule?: string[];
  expectedOutput?: string;
  responsibleUnit?: string;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
  costItems?: CostItemRequest[];
}

// Target request
export interface TargetRequest {
  title: string;
  dueDate?: string;
  indicator?: string;
  baseline?: string;
  targetValue?: string;
  displayOrder?: number;
  subtotal?: number;
  activities?: ActivityRequest[];
}

// Create action plan request
export interface CreateActionPlanRequest {
  financialYear: string;
  title: string;
  description?: string;
  totalBudget?: number;
  targets?: TargetRequest[];
}

// Update action plan request
export interface UpdateActionPlanRequest {
  title?: string;
  description?: string;
  totalBudget?: number;
}

// Update activity progress request
export interface UpdateActivityProgressRequest {
  status?: string;
  progressPercent?: number;
  actualCost?: number;
  comments?: string;
}

// ==================== RESPONSE INTERFACES ====================

// Cost item response
export interface CostItemResponse {
  id: number;
  description: string;
  amount: number;
  fundingSource?: string;
}

// Activity response
export interface ActivityResponse {
  id: number;
  description: string;
  quarterSchedule?: string[];
  expectedOutput?: string;
  responsibleUnit?: string;
  status: string;
  progressPercent: number;
  startDate?: string;
  endDate?: string;
  comments?: string;
  actualCost?: number;
  displayOrder: number;
  costItems: CostItemResponse[];
  budgetedCost: number;
}

// Target response
export interface TargetResponse {
  id: number;
  title: string;
  dueDate?: string;
  indicator?: string;
  baseline?: string;
  targetValue?: string;
  displayOrder: number;
  subtotal: number;
  activities: ActivityResponse[];
  targetProgress: number;
}

// Action plan list response (summary)
export interface ActionPlanResponse {
  id: number;
  financialYear: string;
  title: string;
  version?: string;
  status: string;
  totalBudget: number;
  preparedById?: number;
  preparedByName?: string;
  preparedDate?: string;
  approvedById?: number;
  approvedByName?: string;
  approvedDate?: string;
  targetCount: number;
  activityCount: number;
  completedActivityCount: number;
  overallProgress: number;
  createdAt: string;
  updatedAt: string;
}

// Action plan detail response (full)
export interface ActionPlanDetailResponse {
  id: number;
  financialYear: string;
  title: string;
  version?: string;
  description?: string;
  status: string;
  totalBudget: number;
  preparedById?: number;
  preparedByName?: string;
  preparedDate?: string;
  approvedById?: number;
  approvedByName?: string;
  approvedDate?: string;
  approvalResolution?: string;
  targets: TargetResponse[];
  overallProgress: number;
  totalActualCost: number;
  createdAt: string;
  updatedAt: string;
}
