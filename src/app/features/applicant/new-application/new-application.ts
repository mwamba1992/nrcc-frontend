import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { FormInputComponent, FormSelectComponent, FormTextareaComponent, ButtonComponent, SelectOption } from '../../../shared/components/forms';
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    FormInputComponent,
    FormSelectComponent,
    FormTextareaComponent,
    ButtonComponent
  ],
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
  applicantTypeOptions: SelectOption[] = Object.keys(ApplicantType)
    .filter(k => isNaN(Number(k)))
    .map(key => ({ value: key, label: ApplicantTypeLabels[key] || key }));

  // Road classes
  roadClasses = Object.keys(RoadClass).filter(k => isNaN(Number(k)));
  roadClassLabels = RoadClassLabels;
  roadClassOptions: SelectOption[] = Object.keys(RoadClass)
    .filter(k => isNaN(Number(k)))
    .map(key => ({ value: key, label: RoadClassLabels[key] || key }));

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
  surfaceTypeOptions: SelectOption[] = this.surfaceTypes.map(s => ({ value: s, label: s }));

  // Traffic levels
  trafficLevels = [
    'Very Low (< 100 vpd)',
    'Low (100-500 vpd)',
    'Medium (500-2000 vpd)',
    'High (2000-5000 vpd)',
    'Very High (> 5000 vpd)'
  ];
  trafficLevelOptions: SelectOption[] = this.trafficLevels.map(t => ({ value: t, label: t }));

  // Eligibility criteria for Regional Roads (R1-R7)
  regionalCriteria: EligibilityCriterion[] = [
    { code: 'R1', description: 'Road connects two or more districts within the region', selected: false, details: '', evidenceDescription: '' },
    { code: 'R2', description: 'Road connects to a regional headquarters or major town', selected: false, details: '', evidenceDescription: '' },
    { code: 'R3', description: 'Road serves significant agricultural or industrial areas', selected: false, details: '', evidenceDescription: '' },
    { code: 'R4', description: 'Road has traffic volume exceeding district road standards', selected: false, details: '', evidenceDescription: '' },
    { code: 'R5', description: 'Road connects to important social services (hospitals, schools)', selected: false, details: '', evidenceDescription: '' },
    { code: 'R6', description: 'Road provides alternative route to trunk roads', selected: false, details: '', evidenceDescription: '' },
    { code: 'R7', description: 'Road has strategic importance for regional development', selected: false, details: '', evidenceDescription: '' }
  ];

  // Eligibility criteria for Trunk Roads (T1-T5)
  trunkCriteria: EligibilityCriterion[] = [
    { code: 'T1', description: 'Road connects to national road network or international borders', selected: false, details: '', evidenceDescription: '' },
    { code: 'T2', description: 'Road links regional capitals or major economic centers', selected: false, details: '', evidenceDescription: '' },
    { code: 'T3', description: 'Road connects to ports, airports, or railway terminals', selected: false, details: '', evidenceDescription: '' },
    { code: 'T4', description: 'Road has high traffic volume meeting trunk road standards', selected: false, details: '', evidenceDescription: '' },
    { code: 'T5', description: 'Road has national strategic or economic importance', selected: false, details: '', evidenceDescription: '' }
  ];

  // Active eligibility criteria (changes based on proposed class)
  eligibilityCriteria: EligibilityCriterion[] = [];

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

    // Subscribe to proposedClass changes to update eligibility criteria
    this.applicationForm.get('proposedClass')?.valueChanges.subscribe(value => {
      this.updateEligibilityCriteria(value);
    });
  }

  // Update eligibility criteria based on proposed classification
  updateEligibilityCriteria(proposedClass: string): void {
    // Reset all criteria selections
    this.regionalCriteria.forEach(c => { c.selected = false; c.details = ''; c.evidenceDescription = ''; });
    this.trunkCriteria.forEach(c => { c.selected = false; c.details = ''; c.evidenceDescription = ''; });

    // Set active criteria based on proposed class
    if (proposedClass === 'TRUNK') {
      this.eligibilityCriteria = this.trunkCriteria;
    } else if (proposedClass === 'REGIONAL') {
      this.eligibilityCriteria = this.regionalCriteria;
    } else {
      this.eligibilityCriteria = [];
    }
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

  onRoadSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const roadId = selectElement.value;

    if (roadId) {
      const road = this.roads.find(r => r.id.toString() === roadId);
      if (road) {
        this.selectRoad(road);
      }
    } else {
      this.clearRoadSelection();
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

    // Debug: Print payload before sending
    console.log('=== Application Create Payload ===');
    console.log(JSON.stringify(request, null, 2));

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
    // Reset all criteria arrays
    this.regionalCriteria.forEach(c => {
      c.selected = false;
      c.details = '';
      c.evidenceDescription = '';
    });
    this.trunkCriteria.forEach(c => {
      c.selected = false;
      c.details = '';
      c.evidenceDescription = '';
    });
    this.eligibilityCriteria = [];
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
