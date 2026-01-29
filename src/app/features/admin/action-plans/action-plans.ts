import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { ActionPlanService } from '../../../core/services/action-plan.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import {
  ActionPlanResponse,
  ActionPlanDetailResponse,
  CreateActionPlanRequest,
  TargetRequest,
  TargetResponse,
  ActivityRequest,
  ActivityResponse,
  UpdateActivityProgressRequest,
  ActionPlanStatusLabels,
  ActivityStatusLabels,
  QuarterOptions,
  CostItemRequest
} from '../../../core/models/action-plan.model';

@Component({
  selector: 'app-action-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './action-plans.html',
  styleUrl: './action-plans.scss'
})
export class ActionPlansComponent implements OnInit {
  actionPlans = signal<ActionPlanResponse[]>([]);
  isLoading = signal(false);

  // Modals
  showModal = signal(false);
  showDetailModal = signal(false);
  showTargetModal = signal(false);
  showActivityModal = signal(false);
  showProgressModal = signal(false);

  // Edit modes
  editMode = signal(false);
  editTargetMode = signal(false);
  editActivityMode = signal(false);

  // Current selections
  currentPlan = signal<ActionPlanResponse | null>(null);
  currentPlanDetail = signal<ActionPlanDetailResponse | null>(null);
  currentTarget = signal<TargetResponse | null>(null);
  currentActivity = signal<ActivityResponse | null>(null);

  // Filters
  selectedStatusFilter = signal<string>('');

  // Filtered plans
  filteredPlans = computed(() => {
    let result = this.actionPlans();
    const statusFilter = this.selectedStatusFilter();
    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter);
    }
    return result;
  });

  // Form data
  formData: CreateActionPlanRequest = {
    financialYear: '',
    title: '',
    description: '',
    totalBudget: 0
  };

  targetFormData: TargetRequest = {
    title: '',
    indicator: '',
    baseline: '',
    targetValue: '',
    dueDate: '',
    subtotal: 0
  };

  activityFormData: ActivityRequest = {
    description: '',
    quarterSchedule: [],
    expectedOutput: '',
    responsibleUnit: '',
    startDate: '',
    endDate: '',
    costItems: []
  };

  progressFormData: UpdateActivityProgressRequest = {
    status: '',
    progressPercent: 0,
    actualCost: 0,
    comments: ''
  };

  // New cost item form
  newCostItem: CostItemRequest = { description: '', amount: 0 };

  // Options
  statuses = Object.keys(ActionPlanStatusLabels);
  activityStatuses = Object.keys(ActivityStatusLabels);
  quarterOptions = QuarterOptions;
  financialYearOptions: string[] = [];

  // Table configuration
  tableColumns: DataTableColumn<ActionPlanResponse>[] = [
    {
      key: 'financialYear',
      label: 'Financial Year',
      sortable: true,
      width: '130px',
      class: 'year-cell'
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      class: 'title-cell'
    },
    {
      key: 'totalBudget',
      label: 'Budget (TZS)',
      sortable: true,
      width: '150px',
      align: 'right',
      format: (value) => this.formatCurrency(value)
    },
    {
      key: 'targetCount',
      label: 'Targets',
      sortable: true,
      width: '90px',
      align: 'center'
    },
    {
      key: 'activityCount',
      label: 'Activities',
      sortable: true,
      width: '100px',
      align: 'center'
    },
    {
      key: 'overallProgress',
      label: 'Progress',
      sortable: true,
      width: '120px',
      align: 'center',
      format: (value) => `${value}%`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      align: 'center',
      class: 'status-cell',
      format: (value) => ActionPlanStatusLabels[value] || value
    }
  ];

  tableActions: DataTableAction<ActionPlanResponse>[] = [
    {
      label: 'View/Manage',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z"/>',
      class: 'info',
      onClick: (row) => this.viewPlanDetails(row)
    },
    {
      label: 'Update Progress',
      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
      class: 'warning',
      onClick: (row) => this.viewPlanDetails(row),
      visible: (row) => row.status === 'IN_PROGRESS'
    },
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      class: 'primary',
      onClick: (row) => this.openEditModal(row),
      visible: (row) => row.status === 'DRAFT'
    },
    {
      label: 'Add Targets',
      icon: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      class: 'success',
      onClick: (row) => this.viewPlanDetails(row),
      visible: (row) => row.status === 'DRAFT'
    },
    {
      label: 'Submit',
      icon: '<path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>',
      class: 'success',
      onClick: (row) => this.submitPlan(row),
      visible: (row) => row.status === 'DRAFT'
    },
    {
      label: 'Approve',
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      class: 'success',
      onClick: (row) => this.approvePlan(row),
      visible: (row) => row.status === 'SUBMITTED'
    },
    {
      label: 'Start Execution',
      icon: '<polygon points="5 3 19 12 5 21 5 3"/>',
      class: 'warning',
      onClick: (row) => this.startExecution(row),
      visible: (row) => row.status === 'APPROVED'
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      class: 'danger',
      onClick: (row) => this.deletePlan(row),
      visible: (row) => row.status === 'DRAFT'
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search action plans by title, year...',
    emptyMessage: 'No action plans found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private actionPlanService: ActionPlanService,
    private sweetAlertService: SweetAlertService
  ) {
    this.generateFinancialYears();
  }

  ngOnInit() {
    this.loadActionPlans();
  }

  generateFinancialYears() {
    const currentYear = new Date().getFullYear();
    for (let i = -2; i <= 3; i++) {
      const year = currentYear + i;
      this.financialYearOptions.push(`${year}/${year + 1}`);
    }
  }

  loadActionPlans() {
    this.isLoading.set(true);
    this.actionPlanService.getAllActionPlans().subscribe({
      next: (response) => {
        this.actionPlans.set(response.data.content);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading action plans:', error);
        this.sweetAlertService.error('Error', 'Failed to load action plans.');
        this.isLoading.set(false);
      }
    });
  }

  formatCurrency(value: number): string {
    if (!value) return '-';
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getStatusLabel(status: string): string {
    return ActionPlanStatusLabels[status] || status;
  }

  getActivityStatusLabel(status: string): string {
    return ActivityStatusLabels[status] || status;
  }

  // ==================== FILTER METHODS ====================

  onStatusFilterChange(status: string) {
    this.selectedStatusFilter.set(status);
  }

  clearFilters() {
    this.selectedStatusFilter.set('');
  }

  // ==================== ACTION PLAN MODAL METHODS ====================

  openCreateModal() {
    this.editMode.set(false);
    this.currentPlan.set(null);
    this.formData = {
      financialYear: '',
      title: '',
      description: '',
      totalBudget: 0
    };
    this.showModal.set(true);
  }

  openEditModal(plan: ActionPlanResponse) {
    this.editMode.set(true);
    this.currentPlan.set(plan);
    this.formData = {
      financialYear: plan.financialYear,
      title: plan.title,
      description: '',
      totalBudget: plan.totalBudget
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitForm() {
    if (this.editMode()) {
      this.updatePlan();
    } else {
      this.createPlan();
    }
  }

  createPlan() {
    this.actionPlanService.createActionPlan(this.formData).subscribe({
      next: () => {
        this.sweetAlertService.success('Success!', `Action Plan created.`);
        this.loadActionPlans();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating action plan:', error);
        this.sweetAlertService.error('Error', 'Failed to create action plan.');
      }
    });
  }

  updatePlan() {
    const planId = this.currentPlan()?.id;
    if (!planId) return;

    this.actionPlanService.updateActionPlan(planId, {
      title: this.formData.title,
      description: this.formData.description,
      totalBudget: this.formData.totalBudget
    }).subscribe({
      next: () => {
        this.sweetAlertService.success('Success!', `Action Plan updated.`);
        this.loadActionPlans();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating action plan:', error);
        this.sweetAlertService.error('Error', 'Failed to update action plan.');
      }
    });
  }

  // ==================== DETAIL MODAL METHODS ====================

  viewPlanDetails(plan: ActionPlanResponse) {
    this.actionPlanService.getActionPlanById(plan.id).subscribe({
      next: (response) => {
        this.currentPlanDetail.set(response.data);
        this.showDetailModal.set(true);
      },
      error: (error) => {
        console.error('Error loading plan details:', error);
        this.sweetAlertService.error('Error', 'Failed to load plan details.');
      }
    });
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.currentPlanDetail.set(null);
  }

  refreshPlanDetail() {
    const plan = this.currentPlanDetail();
    if (plan) {
      this.actionPlanService.getActionPlanById(plan.id).subscribe({
        next: (response) => {
          this.currentPlanDetail.set(response.data);
        }
      });
    }
  }

  // ==================== TARGET MODAL METHODS ====================

  openAddTargetModal() {
    this.editTargetMode.set(false);
    this.currentTarget.set(null);
    this.targetFormData = {
      title: '',
      indicator: '',
      baseline: '',
      targetValue: '',
      dueDate: '',
      subtotal: 0
    };
    this.showTargetModal.set(true);
  }

  openEditTargetModal(target: TargetResponse) {
    this.editTargetMode.set(true);
    this.currentTarget.set(target);
    this.targetFormData = {
      title: target.title,
      indicator: target.indicator || '',
      baseline: target.baseline || '',
      targetValue: target.targetValue || '',
      dueDate: target.dueDate || '',
      subtotal: target.subtotal
    };
    this.showTargetModal.set(true);
  }

  closeTargetModal() {
    this.showTargetModal.set(false);
  }

  submitTargetForm() {
    const plan = this.currentPlanDetail();
    if (!plan) return;

    // For now, we only have add target endpoint
    this.actionPlanService.addTarget(plan.id, this.targetFormData).subscribe({
      next: () => {
        this.sweetAlertService.success('Success!', 'Target added.');
        this.refreshPlanDetail();
        this.loadActionPlans();
        this.closeTargetModal();
      },
      error: (error) => {
        console.error('Error adding target:', error);
        this.sweetAlertService.error('Error', 'Failed to add target.');
      }
    });
  }

  // ==================== ACTIVITY MODAL METHODS ====================

  openAddActivityModal(target: TargetResponse) {
    this.editActivityMode.set(false);
    this.currentTarget.set(target);
    this.currentActivity.set(null);
    this.activityFormData = {
      description: '',
      quarterSchedule: [],
      expectedOutput: '',
      responsibleUnit: '',
      startDate: '',
      endDate: '',
      costItems: []
    };
    this.newCostItem = { description: '', amount: 0 };
    this.showActivityModal.set(true);
  }

  closeActivityModal() {
    this.showActivityModal.set(false);
  }

  toggleQuarter(quarter: string) {
    const schedule = this.activityFormData.quarterSchedule || [];
    const index = schedule.indexOf(quarter);
    if (index > -1) {
      schedule.splice(index, 1);
    } else {
      schedule.push(quarter);
    }
    this.activityFormData.quarterSchedule = [...schedule];
  }

  isQuarterSelected(quarter: string): boolean {
    return this.activityFormData.quarterSchedule?.includes(quarter) || false;
  }

  addCostItem() {
    if (this.newCostItem.description && this.newCostItem.amount > 0) {
      if (!this.activityFormData.costItems) {
        this.activityFormData.costItems = [];
      }
      this.activityFormData.costItems.push({ ...this.newCostItem });
      this.newCostItem = { description: '', amount: 0 };
    }
  }

  removeCostItem(index: number) {
    this.activityFormData.costItems?.splice(index, 1);
  }

  getTotalCost(): number {
    return this.activityFormData.costItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  }

  submitActivityForm() {
    const target = this.currentTarget();
    if (!target) return;

    this.actionPlanService.addActivity(target.id, this.activityFormData).subscribe({
      next: () => {
        this.sweetAlertService.success('Success!', 'Activity added.');
        this.refreshPlanDetail();
        this.loadActionPlans();
        this.closeActivityModal();
      },
      error: (error) => {
        console.error('Error adding activity:', error);
        this.sweetAlertService.error('Error', 'Failed to add activity.');
      }
    });
  }

  // ==================== PROGRESS MODAL METHODS ====================

  openProgressModal(activity: ActivityResponse) {
    this.currentActivity.set(activity);
    this.progressFormData = {
      status: activity.status,
      progressPercent: activity.progressPercent,
      actualCost: activity.actualCost || 0,
      comments: activity.comments || ''
    };
    this.showProgressModal.set(true);
  }

  closeProgressModal() {
    this.showProgressModal.set(false);
  }

  submitProgressForm() {
    const activity = this.currentActivity();
    if (!activity) return;

    this.actionPlanService.updateActivityProgress(activity.id, this.progressFormData).subscribe({
      next: () => {
        this.sweetAlertService.success('Success!', 'Progress updated.');
        this.refreshPlanDetail();
        this.loadActionPlans();
        this.closeProgressModal();
      },
      error: (error) => {
        console.error('Error updating progress:', error);
        this.sweetAlertService.error('Error', 'Failed to update progress.');
      }
    });
  }

  // ==================== WORKFLOW ACTIONS ====================

  async submitPlan(plan: ActionPlanResponse) {
    const confirmed = await this.sweetAlertService.confirm(
      'Submit Action Plan',
      `Submit "${plan.title}" for approval?`,
      'Yes, submit',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.submitActionPlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Submitted!', 'Action plan submitted for approval.');
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error submitting plan:', error);
          this.sweetAlertService.error('Error', 'Failed to submit action plan.');
        }
      });
    }
  }

  async approvePlan(plan: ActionPlanResponse) {
    const confirmed = await this.sweetAlertService.confirm(
      'Approve Action Plan',
      `Approve "${plan.title}"?`,
      'Yes, approve',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.approveActionPlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Approved!', 'Action plan has been approved.');
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error approving plan:', error);
          this.sweetAlertService.error('Error', 'Failed to approve action plan.');
        }
      });
    }
  }

  async startExecution(plan: ActionPlanResponse) {
    const confirmed = await this.sweetAlertService.confirm(
      'Start Execution',
      `Start execution of "${plan.title}"?`,
      'Yes, start',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.startExecution(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Started!', 'Action plan execution has started.');
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error starting execution:', error);
          this.sweetAlertService.error('Error', 'Failed to start execution.');
        }
      });
    }
  }

  async deletePlan(plan: ActionPlanResponse) {
    const confirmed = await this.sweetAlertService.confirmDelete(plan.title, 'action plan');

    if (confirmed) {
      this.actionPlanService.deleteActionPlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', 'Action plan has been deleted.');
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error deleting plan:', error);
          this.sweetAlertService.error('Error', 'Failed to delete action plan.');
        }
      });
    }
  }

  // ==================== MODAL WORKFLOW ACTIONS ====================

  async submitPlanFromDetail() {
    const plan = this.currentPlanDetail();
    if (!plan) return;

    const confirmed = await this.sweetAlertService.confirm(
      'Submit Action Plan',
      `Submit "${plan.title}" for approval?`,
      'Yes, submit',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.submitActionPlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Submitted!', 'Action plan submitted for approval.');
          this.refreshPlanDetail();
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error submitting plan:', error);
          this.sweetAlertService.error('Error', 'Failed to submit action plan.');
        }
      });
    }
  }

  async approvePlanFromDetail() {
    const plan = this.currentPlanDetail();
    if (!plan) return;

    const confirmed = await this.sweetAlertService.confirm(
      'Approve Action Plan',
      `Approve "${plan.title}"?`,
      'Yes, approve',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.approveActionPlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Approved!', 'Action plan has been approved.');
          this.refreshPlanDetail();
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error approving plan:', error);
          this.sweetAlertService.error('Error', 'Failed to approve action plan.');
        }
      });
    }
  }

  async startExecutionFromDetail() {
    const plan = this.currentPlanDetail();
    if (!plan) return;

    const confirmed = await this.sweetAlertService.confirm(
      'Start Execution',
      `Start execution of "${plan.title}"?`,
      'Yes, start',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.startExecution(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Started!', 'Action plan execution has started.');
          this.refreshPlanDetail();
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error starting execution:', error);
          this.sweetAlertService.error('Error', 'Failed to start execution.');
        }
      });
    }
  }

  async markPlanComplete() {
    const plan = this.currentPlanDetail();
    if (!plan) return;

    const confirmed = await this.sweetAlertService.confirm(
      'Mark as Complete',
      `Mark "${plan.title}" as completed? This action confirms that all activities have been finished.`,
      'Yes, complete',
      'Cancel'
    );

    if (confirmed) {
      this.actionPlanService.completePlan(plan.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Completed!', 'Action plan has been marked as complete.');
          this.refreshPlanDetail();
          this.loadActionPlans();
        },
        error: (error) => {
          console.error('Error completing plan:', error);
          this.sweetAlertService.error('Error', 'Failed to complete action plan.');
        }
      });
    }
  }

  // ==================== HELPER METHODS ====================

  canEditPlan(): boolean {
    const plan = this.currentPlanDetail();
    return plan?.status === 'DRAFT';
  }

  canUpdateProgress(): boolean {
    const plan = this.currentPlanDetail();
    return plan?.status === 'IN_PROGRESS';
  }
}
