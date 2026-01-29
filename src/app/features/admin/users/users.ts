import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { UserService } from '../../../core/services/user.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { DistrictService } from '../../../core/services/district.service';
import { RegionService } from '../../../core/services/region.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserRoleLabels
} from '../../../core/models/user.model';
import { OrganizationResponse } from '../../../core/models/organization.model';
import { DistrictResponse } from '../../../core/models/district.model';
import { RegionResponse } from '../../../core/models/region.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  users = signal<UserResponse[]>([]);
  organizations = signal<OrganizationResponse[]>([]);
  districts = signal<DistrictResponse[]>([]);
  regions = signal<RegionResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  currentUser = signal<UserResponse | null>(null);

  // Bulk selection
  selectedUserIds = signal<Set<number>>(new Set());
  showBulkActions = computed(() => this.selectedUserIds().size > 0);

  // Filters
  selectedRoleFilter = signal<string>('');
  selectedStatusFilter = signal<string>('');

  // Filtered users
  filteredUsers = computed(() => {
    let result = this.users();
    const roleFilter = this.selectedRoleFilter();
    const statusFilter = this.selectedStatusFilter();

    if (roleFilter) {
      result = result.filter(u => u.role === roleFilter);
    }
    if (statusFilter) {
      result = result.filter(u => u.status === statusFilter);
    }
    return result;
  });

  formData: CreateUserRequest = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
    organizationId: undefined,
    districtId: undefined,
    userType: ''
  };

  // Available roles
  roles = [
    'PUBLIC_APPLICANT',
    'MEMBER_OF_PARLIAMENT',
    'REGIONAL_ROADS_BOARD_INITIATOR',
    'REGIONAL_ADMINISTRATIVE_SECRETARY',
    'REGIONAL_COMMISSIONER',
    'MINISTER_OF_WORKS',
    'NRCC_CHAIRPERSON',
    'NRCC_MEMBER',
    'NRCC_SECRETARIAT',
    'MINISTRY_LAWYER',
    'SYSTEM_ADMINISTRATOR'
  ];

  // User types
  userTypes = [
    'INTERNAL',
    'EXTERNAL'
  ];

  // Statuses for filter
  statuses = ['ACTIVE', 'INACTIVE', 'PENDING'];

  // Table configuration
  tableColumns: DataTableColumn<UserResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      class: 'name-cell'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '200px',
      class: 'email-cell'
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      sortable: true,
      width: '140px',
      format: (value) => value || '-'
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      width: '180px',
      format: (value) => this.formatRole(value)
    },
    {
      key: 'organization',
      label: 'Organization',
      sortable: false,
      width: '180px',
      format: (value: any) => value?.name || '-'
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      width: '120px',
      format: (value) => value || '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '110px',
      align: 'center',
      class: 'status-cell'
    }
  ];

  tableActions: DataTableAction<UserResponse>[] = [
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      class: 'primary',
      onClick: (row) => this.openEditModal(row)
    },
    {
      label: 'Deactivate',
      icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      class: 'warning',
      onClick: (row) => this.toggleStatus(row),
      visible: (row) => row.status === 'ACTIVE'
    },
    {
      label: 'Activate',
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      class: 'success',
      onClick: (row) => this.toggleStatus(row),
      visible: (row) => row.status === 'INACTIVE' || row.status === 'PENDING'
    },
    {
      label: 'Send Verification',
      icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
      class: 'info',
      onClick: (row) => this.sendVerification(row)
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      class: 'danger',
      onClick: (row) => this.deleteUser(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search users by name, email, role, organization...',
    emptyMessage: 'No users found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private districtService: DistrictService,
    private regionService: RegionService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadOrganizations();
    this.loadDistricts();
    this.loadRegions();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.sweetAlertService.error('Error', 'Failed to load users. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  loadOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (response) => {
        this.organizations.set(response.data);
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
      }
    });
  }

  loadDistricts() {
    this.districtService.getAllDistricts().subscribe({
      next: (response) => {
        this.districts.set(response.data);
      },
      error: (error) => {
        console.error('Error loading districts:', error);
      }
    });
  }

  loadRegions() {
    this.regionService.getAllRegions().subscribe({
      next: (response) => {
        this.regions.set(response.data);
      },
      error: (error) => {
        console.error('Error loading regions:', error);
      }
    });
  }

  formatRole(role: string): string {
    return UserRoleLabels[role] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // ==================== FILTER METHODS ====================

  onRoleFilterChange(role: string) {
    this.selectedRoleFilter.set(role);
  }

  onStatusFilterChange(status: string) {
    this.selectedStatusFilter.set(status);
  }

  clearFilters() {
    this.selectedRoleFilter.set('');
    this.selectedStatusFilter.set('');
  }

  // ==================== BULK ACTIONS ====================

  toggleUserSelection(userId: number) {
    const current = new Set(this.selectedUserIds());
    if (current.has(userId)) {
      current.delete(userId);
    } else {
      current.add(userId);
    }
    this.selectedUserIds.set(current);
  }

  selectAllUsers() {
    const allIds = new Set(this.filteredUsers().map(u => u.id));
    this.selectedUserIds.set(allIds);
  }

  clearSelection() {
    this.selectedUserIds.set(new Set());
  }

  async bulkActivate() {
    const ids = Array.from(this.selectedUserIds());
    const confirmed = await this.sweetAlertService.confirm(
      'Bulk Activate',
      `Are you sure you want to activate ${ids.length} user(s)?`,
      'Yes, activate',
      'Cancel'
    );

    if (confirmed) {
      this.userService.bulkAction({ userIds: ids, action: 'ACTIVATE' }).subscribe({
        next: (response) => {
          this.sweetAlertService.success(
            'Success!',
            `${response.data.successCount} user(s) activated successfully.`
          );
          this.loadUsers();
          this.clearSelection();
        },
        error: (error) => {
          console.error('Bulk activate error:', error);
          this.sweetAlertService.error('Error', 'Failed to activate users.');
        }
      });
    }
  }

  async bulkDeactivate() {
    const ids = Array.from(this.selectedUserIds());
    const confirmed = await this.sweetAlertService.confirm(
      'Bulk Deactivate',
      `Are you sure you want to deactivate ${ids.length} user(s)?`,
      'Yes, deactivate',
      'Cancel'
    );

    if (confirmed) {
      this.userService.bulkAction({ userIds: ids, action: 'DEACTIVATE' }).subscribe({
        next: (response) => {
          this.sweetAlertService.success(
            'Success!',
            `${response.data.successCount} user(s) deactivated successfully.`
          );
          this.loadUsers();
          this.clearSelection();
        },
        error: (error) => {
          console.error('Bulk deactivate error:', error);
          this.sweetAlertService.error('Error', 'Failed to deactivate users.');
        }
      });
    }
  }

  async bulkDelete() {
    const ids = Array.from(this.selectedUserIds());
    const confirmed = await this.sweetAlertService.confirm(
      'Bulk Delete',
      `Are you sure you want to delete ${ids.length} user(s)? This action cannot be undone.`,
      'Yes, delete',
      'Cancel'
    );

    if (confirmed) {
      this.userService.bulkAction({ userIds: ids, action: 'DELETE' }).subscribe({
        next: (response) => {
          this.sweetAlertService.success(
            'Success!',
            `${response.data.successCount} user(s) deleted successfully.`
          );
          this.loadUsers();
          this.clearSelection();
        },
        error: (error) => {
          console.error('Bulk delete error:', error);
          this.sweetAlertService.error('Error', 'Failed to delete users.');
        }
      });
    }
  }

  // ==================== MODAL METHODS ====================

  openCreateModal() {
    this.editMode.set(false);
    this.currentUser.set(null);
    this.formData = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
      organizationId: undefined,
      districtId: undefined,
      userType: ''
    };
    this.showModal.set(true);
  }

  openEditModal(user: UserResponse) {
    this.editMode.set(true);
    this.currentUser.set(user);

    this.formData = {
      name: user.name,
      email: user.email,
      password: '', // Don't populate password for edit
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      organizationId: user.organization?.id,
      districtId: undefined, // Need to look up by name
      userType: user.userType || ''
    };

    // Find district ID by name
    if (user.district) {
      const district = this.districts().find(d => d.name === user.district);
      if (district) {
        this.formData.districtId = district.id;
      }
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
      organizationId: undefined,
      districtId: undefined,
      userType: ''
    };
  }

  submitForm() {
    if (this.editMode()) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    if (!this.formData.password) {
      this.sweetAlertService.error('Validation Error', 'Password is required for new users.');
      return;
    }

    this.userService.createUser(this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `User "${this.formData.name}" has been created successfully.`);
        this.loadUsers();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        const message = error.error?.message || 'Failed to create user. Please check your inputs and try again.';
        this.sweetAlertService.error('Error', message);
      }
    });
  }

  updateUser() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    const updateRequest: UpdateUserRequest = {
      name: this.formData.name,
      email: this.formData.email,
      phoneNumber: this.formData.phoneNumber,
      role: this.formData.role,
      organizationId: this.formData.organizationId,
      districtId: this.formData.districtId,
      userType: this.formData.userType
    };

    this.userService.updateUser(userId, updateRequest).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `User "${this.formData.name}" has been updated successfully.`);
        this.loadUsers();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        const message = error.error?.message || 'Failed to update user. Please check your inputs and try again.';
        this.sweetAlertService.error('Error', message);
      }
    });
  }

  // ==================== SINGLE USER ACTIONS ====================

  async deleteUser(user: UserResponse) {
    const confirmed = await this.sweetAlertService.confirmDelete(user.name, 'user');

    if (confirmed) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', `User "${user.name}" has been deleted successfully.`);
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.sweetAlertService.error('Error', 'Failed to delete user. Please try again.');
        }
      });
    }
  }

  async toggleStatus(user: UserResponse) {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = await this.sweetAlertService.confirmToggleStatus(
      user.name,
      user.status,
      newStatus
    );

    if (confirmed) {
      const action = user.status === 'ACTIVE' ? 'deactivated' : 'activated';

      if (user.status === 'ACTIVE') {
        this.userService.deactivateUser(user.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `User "${user.name}" has been ${action}.`);
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deactivating user:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      } else {
        this.userService.activateUser(user.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `User "${user.name}" has been ${action}.`);
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error activating user:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      }
    }
  }

  async sendVerification(user: UserResponse) {
    const confirmed = await this.sweetAlertService.confirm(
      'Send Verification Email',
      `Send email verification to ${user.email}?`,
      'Yes, send',
      'Cancel'
    );

    if (confirmed) {
      this.userService.sendEmailVerification(user.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Sent!', `Verification email sent to ${user.email}`);
        },
        error: (error) => {
          console.error('Error sending verification:', error);
          this.sweetAlertService.error('Error', 'Failed to send verification email.');
        }
      });
    }
  }

  // ==================== UTILITY ====================

  isSelected(userId: number): boolean {
    return this.selectedUserIds().has(userId);
  }
}
