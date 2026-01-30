import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { RegionService } from '../../../core/services/region.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { RegionResponse, CreateRegionRequest } from '../../../core/models/region.model';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './regions.html',
  styleUrl: './regions.scss'
})
export class RegionsComponent implements OnInit {
  regions = signal<RegionResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  currentRegion = signal<RegionResponse | null>(null);

  formData: CreateRegionRequest = {
    code: '',
    name: '',
    description: ''
  };

  // Table configuration
  tableColumns: DataTableColumn<RegionResponse>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      width: '100px',
      class: 'code-cell'
    },
    {
      key: 'name',
      label: 'Region Name',
      sortable: true,
      class: 'name-cell'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      class: 'description-cell',
      format: (value) => value || '-'
    },
    {
      key: 'districtCount',
      label: 'Districts',
      sortable: true,
      width: '120px',
      align: 'center',
      format: (value) => value?.toString() || '0'
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

  tableActions: DataTableAction<RegionResponse>[] = [
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
      onClick: (row) => this.deleteRegion(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search regions by name, code, or description...',
    emptyMessage: 'No regions found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private regionService: RegionService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadRegions();
  }

  loadRegions() {
    this.isLoading.set(true);
    this.regionService.getAllRegions().subscribe({
      next: (response) => {
        this.regions.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading regions:', error);
        this.isLoading.set(false);
        this.sweetAlertService.error('Error', 'Failed to load regions. Please try again.');
      }
    });
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentRegion.set(null);
    this.formData = {
      code: '',
      name: '',
      description: ''
    };
    this.showModal.set(true);
  }

  openEditModal(region: RegionResponse) {
    this.editMode.set(true);
    this.currentRegion.set(region);
    this.formData = {
      code: region.code,
      name: region.name,
      description: region.description
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData = { code: '', name: '', description: '' };
  }

  submitForm() {
    if (this.editMode()) {
      this.updateRegion();
    } else {
      this.createRegion();
    }
  }

  createRegion() {
    this.regionService.createRegion(this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Region "${this.formData.name}" has been created successfully.`);
        this.loadRegions();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating region:', error);
        this.sweetAlertService.error('Error', 'Failed to create region. Please try again.');
      }
    });
  }

  updateRegion() {
    const regionId = this.currentRegion()?.id;
    if (!regionId) return;

    this.regionService.updateRegion(regionId, this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Region "${this.formData.name}" has been updated successfully.`);
        this.loadRegions();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating region:', error);
        this.sweetAlertService.error('Error', 'Failed to update region. Please try again.');
      }
    });
  }

  async deleteRegion(region: RegionResponse) {
    const confirmed = await this.sweetAlertService.confirmDelete(region.name, 'region');

    if (confirmed) {
      this.regionService.deleteRegion(region.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', `Region "${region.name}" has been deleted successfully.`);
          this.loadRegions();
        },
        error: (error) => {
          console.error('Error deleting region:', error);
          this.sweetAlertService.error('Error', 'Failed to delete region. Please try again.');
        }
      });
    }
  }

  async toggleStatus(region: RegionResponse) {
    const newStatus = region.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = await this.sweetAlertService.confirmToggleStatus(
      region.name,
      region.status,
      newStatus
    );

    if (confirmed) {
      const action = region.status === 'ACTIVE' ? 'deactivated' : 'activated';

      if (region.status === 'ACTIVE') {
        this.regionService.deactivateRegion(region.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Region "${region.name}" has been ${action}.`);
            this.loadRegions();
          },
          error: (error) => {
            console.error('Error deactivating region:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      } else {
        this.regionService.activateRegion(region.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Region "${region.name}" has been ${action}.`);
            this.loadRegions();
          },
          error: (error) => {
            console.error('Error activating region:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      }
    }
  }
}
