import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { OrganizationService } from '../../../core/services/organization.service';
import { DistrictService } from '../../../core/services/district.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { OrganizationResponse, CreateOrganizationRequest } from '../../../core/models/organization.model';
import { DistrictResponse } from '../../../core/models/district.model';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './organizations.html',
  styleUrl: './organizations.scss'
})
export class OrganizationsComponent implements OnInit {
  organizations = signal<OrganizationResponse[]>([]);
  districts = signal<DistrictResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  currentOrganization = signal<OrganizationResponse | null>(null);

  formData: CreateOrganizationRequest = {
    code: '',
    name: '',
    organizationType: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    description: '',
    address: '',
    districtId: undefined
  };

  // Organization types
  organizationTypes = [
    'REGIONAL_SECRETARIAT',
    'DISTRICT_COUNCIL',
    'MUNICIPAL_COUNCIL',
    'CITY_COUNCIL',
    'TOWN_COUNCIL',
    'CONTRACTOR',
    'CONSULTANT',
    'OTHER'
  ];

  // Table configuration
  tableColumns: DataTableColumn<OrganizationResponse>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '100px',
      class: 'code-cell'
    },
    {
      key: 'name',
      label: 'Organization Name',
      sortable: true,
      class: 'name-cell'
    },
    {
      key: 'organizationType',
      label: 'Type',
      sortable: true,
      width: '150px',
      format: (value) => this.formatOrganizationType(value)
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      sortable: true,
      width: '160px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '180px',
      class: 'email-cell'
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      sortable: true,
      width: '130px'
    },
    {
      key: 'district',
      label: 'District',
      sortable: true,
      width: '130px',
      format: (value) => value || '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      align: 'center',
      class: 'status-cell'
    }
  ];

  tableActions: DataTableAction<OrganizationResponse>[] = [
    {
      label: 'Edit',
      icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      class: 'primary',
      onClick: (row) => this.openEditModal(row)
    },
    {
      label: 'Toggle Status',
      icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      class: 'success',
      onClick: (row) => this.toggleStatus(row),
      visible: (row) => row.status === 'ACTIVE'
    },
    {
      label: 'Activate',
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      class: 'success',
      onClick: (row) => this.toggleStatus(row),
      visible: (row) => row.status === 'INACTIVE'
    },
    {
      label: 'Delete',
      icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      class: 'danger',
      onClick: (row) => this.deleteOrganization(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search organizations by name, code, type, contact, email...',
    emptyMessage: 'No organizations found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private organizationService: OrganizationService,
    private districtService: DistrictService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadOrganizations();
    this.loadDistricts();
  }

  loadOrganizations() {
    this.isLoading.set(true);
    this.organizationService.getAllOrganizations().subscribe({
      next: (response) => {
        this.organizations.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        this.sweetAlertService.error('Error', 'Failed to load organizations. Please try again.');
        this.isLoading.set(false);
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

  formatOrganizationType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentOrganization.set(null);
    this.formData = {
      code: '',
      name: '',
      organizationType: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      description: '',
      address: '',
      districtId: undefined
    };
    this.showModal.set(true);
  }

  openEditModal(organization: OrganizationResponse) {
    this.editMode.set(true);
    this.currentOrganization.set(organization);

    // Find district ID by name
    const district = this.districts().find(d => d.name === organization.district);

    this.formData = {
      code: organization.code,
      name: organization.name,
      organizationType: organization.organizationType,
      contactPerson: organization.contactPerson,
      email: organization.email,
      phoneNumber: organization.phoneNumber,
      description: organization.description,
      address: organization.address,
      districtId: district?.id
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData = {
      code: '',
      name: '',
      organizationType: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      description: '',
      address: '',
      districtId: undefined
    };
  }

  submitForm() {
    if (this.editMode()) {
      this.updateOrganization();
    } else {
      this.createOrganization();
    }
  }

  createOrganization() {
    this.organizationService.createOrganization(this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Organization "${this.formData.name}" has been created successfully.`);
        this.loadOrganizations();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating organization:', error);
        this.sweetAlertService.error('Error', 'Failed to create organization. Please check your inputs and try again.');
      }
    });
  }

  updateOrganization() {
    const organizationId = this.currentOrganization()?.id;
    if (!organizationId) return;

    this.organizationService.updateOrganization(organizationId, this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Organization "${this.formData.name}" has been updated successfully.`);
        this.loadOrganizations();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating organization:', error);
        this.sweetAlertService.error('Error', 'Failed to update organization. Please check your inputs and try again.');
      }
    });
  }

  async deleteOrganization(organization: OrganizationResponse) {
    const confirmed = await this.sweetAlertService.confirmDelete(organization.name, 'organization');

    if (confirmed) {
      this.organizationService.deleteOrganization(organization.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', `Organization "${organization.name}" has been deleted successfully.`);
          this.loadOrganizations();
        },
        error: (error) => {
          console.error('Error deleting organization:', error);
          this.sweetAlertService.error('Error', 'Failed to delete organization. Please try again.');
        }
      });
    }
  }

  async toggleStatus(organization: OrganizationResponse) {
    const newStatus = organization.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = await this.sweetAlertService.confirmToggleStatus(
      organization.name,
      organization.status,
      newStatus
    );

    if (confirmed) {
      const action = organization.status === 'ACTIVE' ? 'deactivated' : 'activated';

      if (organization.status === 'ACTIVE') {
        this.organizationService.deactivateOrganization(organization.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Organization "${organization.name}" has been ${action}.`);
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Error deactivating organization:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      } else {
        this.organizationService.activateOrganization(organization.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Organization "${organization.name}" has been ${action}.`);
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Error activating organization:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      }
    }
  }
}
