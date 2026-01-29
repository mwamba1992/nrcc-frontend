import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewerLayoutComponent } from '../../../shared/components/reviewer-layout/reviewer-layout';
import { DataTableComponent, DataTableColumn, DataTableAction, DataTableConfig } from '../../../shared/components/data-table/data-table';
import { RoadService } from '../../../core/services/road.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import { RoadResponse, CreateRoadRequest } from '../../../core/models/road.model';

@Component({
  selector: 'app-roads',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReviewerLayoutComponent, DataTableComponent],
  templateUrl: './roads.html',
  styleUrl: './roads.scss'
})
export class RoadsComponent implements OnInit {
  roads = signal<RoadResponse[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editMode = signal(false);
  currentRoad = signal<RoadResponse | null>(null);

  formData: CreateRoadRequest = {
    name: '',
    currentClass: '' as any,
    roadNumber: '',
    length: undefined,
    startPoint: '',
    endPoint: '',
    region: '',
    district: '',
    surfaceType: '',
    carriagewayWidth: undefined,
    formationWidth: undefined,
    roadReserveWidth: undefined,
    description: ''
  };

  // Road classes (Tanzania road classification)
  roadClasses = [
    'TRUNK',
    'REGIONAL',
    'DISTRICT'
  ];

  // Surface types
  surfaceTypes = [
    'Paved',
    'Gravel',
    'Earth',
    'Mixed'
  ];

  // Table configuration
  tableColumns: DataTableColumn<RoadResponse>[] = [
    {
      key: 'roadNumber',
      label: 'Road No.',
      sortable: true,
      width: '110px',
      class: 'code-cell',
      format: (value) => value || '-'
    },
    {
      key: 'name',
      label: 'Road Name',
      sortable: true,
      class: 'name-cell'
    },
    {
      key: 'currentClass',
      label: 'Class',
      sortable: true,
      width: '120px',
      format: (value) => value || '-'
    },
    {
      key: 'district',
      label: 'District',
      sortable: true,
      width: '130px',
      format: (value) => value || '-'
    },
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      width: '120px',
      format: (value) => value || '-'
    },
    {
      key: 'length',
      label: 'Length (km)',
      sortable: true,
      width: '110px',
      align: 'right',
      format: (value) => value ? `${value} km` : '-'
    },
    {
      key: 'surfaceType',
      label: 'Surface',
      sortable: true,
      width: '120px',
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

  tableActions: DataTableAction<RoadResponse>[] = [
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
      onClick: (row) => this.deleteRoad(row)
    }
  ];

  tableConfig: DataTableConfig = {
    searchPlaceholder: 'Search roads by number, name, district, region...',
    emptyMessage: 'No roads found',
    pageSize: 10,
    showPagination: true,
    showSearch: true
  };

  constructor(
    private roadService: RoadService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit() {
    this.loadRoads();
  }

  loadRoads() {
    this.isLoading.set(true);
    this.roadService.getAllRoads().subscribe({
      next: (response) => {
        this.roads.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading roads:', error);
        this.sweetAlertService.error('Error', 'Failed to load roads. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  formatEnum(value: string): string {
    if (!value) return '-';
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  openCreateModal() {
    this.editMode.set(false);
    this.currentRoad.set(null);
    this.formData = {
      name: '',
      currentClass: '' as any,
      roadNumber: '',
      length: undefined,
      startPoint: '',
      endPoint: '',
      region: '',
      district: '',
      surfaceType: '',
      carriagewayWidth: undefined,
      formationWidth: undefined,
      roadReserveWidth: undefined,
      description: ''
    };
    this.showModal.set(true);
  }

  openEditModal(road: RoadResponse) {
    this.editMode.set(true);
    this.currentRoad.set(road);

    this.formData = {
      name: road.name,
      currentClass: road.currentClass as any,
      roadNumber: road.roadNumber || '',
      length: road.length,
      startPoint: road.startPoint || '',
      endPoint: road.endPoint || '',
      region: road.region || '',
      district: road.district || '',
      surfaceType: road.surfaceType || '',
      carriagewayWidth: road.carriagewayWidth,
      formationWidth: road.formationWidth,
      roadReserveWidth: road.roadReserveWidth,
      description: road.description || ''
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData = {
      name: '',
      currentClass: '' as any,
      roadNumber: '',
      length: undefined,
      startPoint: '',
      endPoint: '',
      region: '',
      district: '',
      surfaceType: '',
      carriagewayWidth: undefined,
      formationWidth: undefined,
      roadReserveWidth: undefined,
      description: ''
    };
  }

  submitForm() {
    if (this.editMode()) {
      this.updateRoad();
    } else {
      this.createRoad();
    }
  }

  createRoad() {
    this.roadService.createRoad(this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Road "${this.formData.name}" has been created successfully.`);
        this.loadRoads();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating road:', error);
        this.sweetAlertService.error('Error', 'Failed to create road. Please check your inputs and try again.');
      }
    });
  }

  updateRoad() {
    const roadId = this.currentRoad()?.id;
    if (!roadId) return;

    this.roadService.updateRoad(roadId, this.formData).subscribe({
      next: (response) => {
        this.sweetAlertService.success('Success!', `Road "${this.formData.name}" has been updated successfully.`);
        this.loadRoads();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating road:', error);
        this.sweetAlertService.error('Error', 'Failed to update road. Please check your inputs and try again.');
      }
    });
  }

  async deleteRoad(road: RoadResponse) {
    const roadIdentifier = road.roadNumber || road.name;
    const confirmed = await this.sweetAlertService.confirmDelete(roadIdentifier, 'road');

    if (confirmed) {
      this.roadService.deleteRoad(road.id).subscribe({
        next: () => {
          this.sweetAlertService.success('Deleted!', `Road "${roadIdentifier}" has been deleted successfully.`);
          this.loadRoads();
        },
        error: (error) => {
          console.error('Error deleting road:', error);
          this.sweetAlertService.error('Error', 'Failed to delete road. Please try again.');
        }
      });
    }
  }

  async toggleStatus(road: RoadResponse) {
    const roadIdentifier = road.roadNumber || road.name;
    const newStatus = road.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = await this.sweetAlertService.confirmToggleStatus(
      roadIdentifier,
      road.status,
      newStatus
    );

    if (confirmed) {
      const action = road.status === 'ACTIVE' ? 'deactivated' : 'activated';

      if (road.status === 'ACTIVE') {
        this.roadService.deactivateRoad(road.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Road "${roadIdentifier}" has been ${action}.`);
            this.loadRoads();
          },
          error: (error) => {
            console.error('Error deactivating road:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      } else {
        this.roadService.activateRoad(road.id).subscribe({
          next: () => {
            this.sweetAlertService.success('Status Updated!', `Road "${roadIdentifier}" has been ${action}.`);
            this.loadRoads();
          },
          error: (error) => {
            console.error('Error activating road:', error);
            this.sweetAlertService.error('Error', 'Failed to update status. Please try again.');
          }
        });
      }
    }
  }
}
