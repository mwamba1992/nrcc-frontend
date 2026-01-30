import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { DistrictService } from '../../../core/services/district.service';
import { RegionService } from '../../../core/services/region.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { DistrictResponse, CreateDistrictRequest } from '../../../core/models/district.model';
import { RegionResponse } from '../../../core/models/region.model';

@Component({
  selector: 'app-districts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './districts.html',
  styleUrl: './districts.scss'
})
export class DistrictsComponent implements OnInit {
  districts = signal<DistrictResponse[]>([]);
  regions = signal<RegionResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  currentDistrict = signal<DistrictResponse | null>(null);

  formData: CreateDistrictRequest = {
    code: '',
    name: '',
    regionId: 0,
    description: ''
  };

  // Table configuration
  tableColumns: DataTableColumn<DistrictResponse>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '100px',
      class: 'code-cell'
    },
    {
      key: 'name',
      label: 'District Name',
      sortable: true,
      class: 'name-cell'
    },
    {
      key: 'regionName',
      label: 'Region',
      sortable: true,
      width: '180px',
      class: 'region-cell'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      class: 'description-cell',
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

  tableActions: DataTableAction<DistrictResponse>[] = [
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
      onClick: (row) => this.deleteDistrict(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search districts by name, code, region, or description...',
    emptyMessage: 'No districts found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private districtService: DistrictService,
    private regionService: RegionService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadDistricts();
    this.loadRegions();
  }

  loadDistricts() {
    this.isLoading.set(true);
    this.districtService.getAllDistricts().subscribe({
      next: (response) => {
        this.districts.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.isLoading.set(false);
        this.sweetAlertService.error('Error', 'Failed to load districts. Please try again.');
      }
    });
  }

  loadRegions() {
    this.regionService.getActiveRegions().subscribe({
      next: (response) => {
        this.regions.set(response.data);
      },
      error: (error) => {
        console.error('Error loading regions:', error);
        this.sweetAlertService.error('Error', 'Failed to load regions for selection.');
      }
    });
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentDistrict.set(null);
    this.formData = {
      code: '',
      name: '',
      regionId: 0,
      description: ''
    };
    this.showModal.set(true);
  }

  openEditModal(district: DistrictResponse) {
    this.editMode.set(true);
    this.currentDistrict.set(district);
    this.formData = {
      code: district.code,
      name: district.name,
      regionId: district.regionId,
      description: district.description
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData = { code: '', name: '', regionId: 0, description: '' };
  }

  submitForm() {
    if (this.editMode()) {
      this.updateDistrict();
    } else {
      this.createDistrict();
    }
  }

  createDistrict() {
    this.districtService.createDistrict(this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `District "${this.formData.name}" has been created successfully.`);
        this.loadDistricts();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating district:', error);
        this.sweetAlertService.error('Error', 'Failed to create district. Please try again.');
      }
    });
  }

  updateDistrict() {
    const districtId = this.currentDistrict()?.id;
    if (!districtId) return;

    this.districtService.updateDistrict(districtId, this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `District "${this.formData.name}" has been updated successfully.`);
        this.loadDistricts();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating district:', error);
        this.sweetAlertService.error('Error', 'Failed to update district. Please try again.');
      }
    });
  }

  async deleteDistrict(district: DistrictResponse) {
    const confirmed = await this.sweetAlertService.confirmDelete(district.name, 'district');

    if (confirmed) {
      this.districtService.deleteDistrict(district.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', `District "${district.name}" has been deleted successfully.`);
          this.loadDistricts();
        },
        error: (error) => {
          console.error('Error deleting district:', error);
          this.sweetAlertService.error('Error', 'Failed to delete district. Please try again.');
        }
      });
    }
  }

  async toggleStatus(district: DistrictResponse) {
    const newStatus = district.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = await this.sweetAlertService.confirmToggleStatus(
      district.name,
      district.status,
      newStatus
    );

    if (confirmed) {
      const action = district.status === 'ACTIVE' ? 'deactivated' : 'activated';

      if (district.status === 'ACTIVE') {
        this.districtService.deactivateDistrict(district.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `District "${district.name}" has been ${action}.`);
            this.loadDistricts();
          },
          error: (error) => {
            console.error('Error deactivating district:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      } else {
        this.districtService.activateDistrict(district.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `District "${district.name}" has been ${action}.`);
            this.loadDistricts();
          },
          error: (error) => {
            console.error('Error activating district:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      }
    }
  }
}
