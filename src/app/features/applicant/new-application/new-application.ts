import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { ApplicationService } from '../../../core/services/application.service';
import { RoadService } from '../../../core/services/road.service';
import { SweetAlertService } from '../../../core/services/sweetalert.service';
import {
  CreateApplicationRequest,
  EligibilityCriterionRequest,
  ApplicantType,
  ApplicantTypeLabels,
  RoadClass,
  RoadClassLabels
} from '../../../core/models/application.model';
import { RoadResponse } from '../../../core/models/road.model';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

interface EligibilityCriterion {
  code: string;
  description: string;
  selected: boolean;
  details: string;
  evidenceDescription: string;
}

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './new-application.html',
  styleUrl: './new-application.scss'
})
export class NewApplicationComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() applicationSubmitted = new EventEmitter<void>();

  currentStep = 1;
  totalSteps = 6;
  applicationForm!: FormGroup;
  uploadedDocuments: UploadedFile[] = [];
  isSubmitting = false;
  isLoadingRoads = false;
  roadsLoadError = '';

  // Roads list
  roads: RoadResponse[] = [];
  filteredRoads: RoadResponse[] = [];
  selectedRoad: RoadResponse | null = null;
  roadSearchQuery = '';

  // Applicant types
  applicantTypes = Object.keys(ApplicantType).filter(k => isNaN(Number(k)));
  applicantTypeLabels = ApplicantTypeLabels;

  // Road classes
  roadClasses = Object.keys(RoadClass).filter(k => isNaN(Number(k)));
  roadClassLabels = RoadClassLabels;

  // Surface types
  surfaceTypes = [
    'Asphalt',
    'Concrete',
    'Gravel',
    'Earth',
    'Surface Dressed',
    'Interlocking Blocks',
    'Other'
  ];

  // Traffic levels
  trafficLevels = [
    'Very Low (< 100 vpd)',
    'Low (100-500 vpd)',
    'Medium (500-2000 vpd)',
    'High (2000-5000 vpd)',
    'Very High (> 5000 vpd)'
  ];

  // Eligibility criteria
  eligibilityCriteria: EligibilityCriterion[] = [
    { code: 'EC001', description: 'Road connects two or more districts', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC002', description: 'Road serves as a major transport corridor', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC003', description: 'Road has significant economic importance', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC004', description: 'Road connects to national/regional infrastructure', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC005', description: 'Road serves a population center of significant size', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC006', description: 'Road has strategic importance for national security', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC007', description: 'Road links to ports, airports, or border posts', selected: false, details: '', evidenceDescription: '' },
    { code: 'EC008', description: 'Road serves tourism or heritage sites', selected: false, details: '', evidenceDescription: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private applicationService: ApplicationService,
    private roadService: RoadService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoads();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      // Step 1: Applicant & Road Selection
      applicantType: ['INDIVIDUAL', Validators.required],
      roadId: ['', Validators.required],
      roadName: ['', [Validators.required, Validators.minLength(3)]],
      startingPoint: ['', Validators.required],
      terminalPoint: ['', Validators.required],
      roadLength: ['', [Validators.required, Validators.min(0.1)]],

      // Step 2: Classification
      currentClass: ['', Validators.required],
      proposedClass: ['', Validators.required],
      reclassificationReasons: ['', [Validators.required, Validators.minLength(50)]],

      // Step 3: Road Characteristics
      surfaceTypeCarriageway: ['', Validators.required],
      surfaceTypeShoulders: [''],
      carriagewayWidth: ['', [Validators.required, Validators.min(1)]],
      formationWidth: ['', [Validators.required, Validators.min(1)]],
      actualRoadReserveWidth: ['', [Validators.required, Validators.min(1)]],

      // Step 4: Traffic & Connectivity
      trafficLevel: ['', Validators.required],
      trafficComposition: ['', Validators.required],
      townsVillagesLinked: ['', Validators.required],
      principalNodes: [''],
      busRoutes: ['', Validators.required],
      publicServices: ['', Validators.required],
      alternativeRoutes: ['']
    });
  }

  loadRoads(): void {
    this.isLoadingRoads = true;
    this.roadsLoadError = '';
    this.roadService.getAllRoads().subscribe({
      next: (response) => {
        this.roads = response.data || [];
        this.filteredRoads = [...this.roads];
        this.isLoadingRoads = false;
      },
      error: (error) => {
        console.error('Error loading roads:', error);
        this.isLoadingRoads = false;
        if (error.status === 401) {
          this.roadsLoadError = 'Session expired. Please log out and log in again.';
        } else if (error.status === 403) {
          this.roadsLoadError = 'You do not have permission to view roads.';
        } else {
          this.roadsLoadError = 'Failed to load roads. Please try again.';
        }
      }
    });
  }

  filterRoads(): void {
    const query = this.roadSearchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredRoads = [...this.roads];
    } else {
      this.filteredRoads = this.roads.filter(road =>
        road.name.toLowerCase().includes(query) ||
        road.roadNumber?.toLowerCase().includes(query) ||
        road.region?.toLowerCase().includes(query) ||
        road.district?.toLowerCase().includes(query)
      );
    }
  }

  selectRoad(road: RoadResponse): void {
    this.selectedRoad = road;
    this.applicationForm.patchValue({
      roadId: road.id,
      roadName: road.name,
      startingPoint: road.startPoint || '',
      terminalPoint: road.endPoint || '',
      roadLength: road.length || '',
      currentClass: road.currentClass || '',
      surfaceTypeCarriageway: road.surfaceType || '',
      carriagewayWidth: road.carriagewayWidth || '',
      formationWidth: road.formationWidth || '',
      actualRoadReserveWidth: road.roadReserveWidth || ''
    });
  }

  clearRoadSelection(): void {
    this.selectedRoad = null;
    this.roadSearchQuery = '';
    this.filteredRoads = [...this.roads];
    this.applicationForm.patchValue({
      roadId: '',
      roadName: '',
      startingPoint: '',
      terminalPoint: '',
      roadLength: '',
      currentClass: ''
    });
  }

  // Step navigation
  nextStep(): void {
    if (this.isStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.markStepAsTouched();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.selectedRoad !== null &&
          ['applicantType', 'roadName', 'startingPoint', 'terminalPoint', 'roadLength']
          .every(field => this.applicationForm.get(field)?.valid);
      case 2:
        return ['currentClass', 'proposedClass', 'reclassificationReasons']
          .every(field => this.applicationForm.get(field)?.valid);
      case 3:
        return ['surfaceTypeCarriageway', 'carriagewayWidth', 'formationWidth', 'actualRoadReserveWidth']
          .every(field => this.applicationForm.get(field)?.valid);
      case 4:
        return ['trafficLevel', 'trafficComposition', 'townsVillagesLinked', 'busRoutes', 'publicServices']
          .every(field => this.applicationForm.get(field)?.valid);
      case 5:
        return this.getSelectedCriteria().length >= 1;
      case 6:
        return true;
      default:
        return false;
    }
  }

  markStepAsTouched(): void {
    const stepFields: Record<number, string[]> = {
      1: ['applicantType', 'roadName', 'startingPoint', 'terminalPoint', 'roadLength'],
      2: ['currentClass', 'proposedClass', 'reclassificationReasons'],
      3: ['surfaceTypeCarriageway', 'carriagewayWidth', 'formationWidth', 'actualRoadReserveWidth'],
      4: ['trafficLevel', 'trafficComposition', 'townsVillagesLinked', 'busRoutes', 'publicServices']
    };

    const fields = stepFields[this.currentStep] || [];
    fields.forEach(field => {
      this.applicationForm.get(field)?.markAsTouched();
    });
  }

  // Eligibility criteria management
  toggleCriterion(index: number): void {
    this.eligibilityCriteria[index].selected = !this.eligibilityCriteria[index].selected;
  }

  getSelectedCriteria(): EligibilityCriterion[] {
    return this.eligibilityCriteria.filter(c => c.selected);
  }

  // File handling
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.size <= 10 * 1024 * 1024) {
          this.uploadedDocuments.push({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
          });
        } else {
          this.sweetAlertService.warning('File Too Large', `${file.name} exceeds the 10MB limit.`);
        }
      });
      input.value = '';
    }
  }

  removeDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('word') || type.includes('document')) return 'document';
    return 'file';
  }

  // Form submission
  submitApplication(): void {
    if (!this.isFormComplete()) {
      this.sweetAlertService.warning('Incomplete Form', 'Please complete all required fields.');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.applicationForm.value;

    const eligibilityCriteria: EligibilityCriterionRequest[] = this.getSelectedCriteria().map(c => ({
      criterionCode: c.code,
      details: c.details || undefined,
      evidenceDescription: c.evidenceDescription || undefined
    }));

    const request: CreateApplicationRequest = {
      applicantType: formValue.applicantType,
      roadName: formValue.roadName,
      roadLength: parseFloat(formValue.roadLength),
      currentClass: formValue.currentClass,
      proposedClass: formValue.proposedClass,
      startingPoint: formValue.startingPoint,
      terminalPoint: formValue.terminalPoint,
      reclassificationReasons: formValue.reclassificationReasons,
      surfaceTypeCarriageway: formValue.surfaceTypeCarriageway,
      surfaceTypeShoulders: formValue.surfaceTypeShoulders || undefined,
      carriagewayWidth: parseFloat(formValue.carriagewayWidth),
      formationWidth: parseFloat(formValue.formationWidth),
      actualRoadReserveWidth: parseFloat(formValue.actualRoadReserveWidth),
      trafficLevel: formValue.trafficLevel,
      trafficComposition: formValue.trafficComposition,
      townsVillagesLinked: formValue.townsVillagesLinked,
      principalNodes: formValue.principalNodes || undefined,
      busRoutes: formValue.busRoutes,
      publicServices: formValue.publicServices,
      alternativeRoutes: formValue.alternativeRoutes || undefined,
      eligibilityCriteria: eligibilityCriteria
    };

    this.applicationService.createApplication(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.sweetAlertService.success('Application Created!', `Your application has been saved as draft. Reference: ${response.data.applicationNumber}`);
        this.resetForm();
        this.applicationSubmitted.emit();
        this.closeModal.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating application:', error);
        this.sweetAlertService.error('Error', error.error?.message || 'Failed to create application. Please try again.');
      }
    });
  }

  isFormComplete(): boolean {
    return this.applicationForm.valid && this.getSelectedCriteria().length >= 1 && this.selectedRoad !== null;
  }

  cancel(): void {
    if (this.applicationForm.dirty || this.uploadedDocuments.length > 0 || this.selectedRoad !== null) {
      this.sweetAlertService.confirm(
        'Cancel Application',
        'Are you sure you want to cancel? All progress will be lost.',
        'Yes, cancel',
        'No, continue'
      ).then(confirmed => {
        if (confirmed) {
          this.doClose();
        }
      });
    } else {
      this.doClose();
    }
  }

  doClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  resetForm(): void {
    this.currentStep = 1;
    this.applicationForm.reset({ applicantType: 'INDIVIDUAL' });
    this.uploadedDocuments = [];
    this.selectedRoad = null;
    this.roadSearchQuery = '';
    this.filteredRoads = [...this.roads];
    this.eligibilityCriteria.forEach(c => {
      c.selected = false;
      c.details = '';
      c.evidenceDescription = '';
    });
  }

  getStepIcon(step: number): string {
    if (step < this.currentStep) return 'check';
    return step.toString();
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  getStepTitle(step: number): string {
    const titles: Record<number, string> = {
      1: 'Road Selection',
      2: 'Classification',
      3: 'Road Details',
      4: 'Connectivity',
      5: 'Eligibility',
      6: 'Documents'
    };
    return titles[step] || '';
  }
}
