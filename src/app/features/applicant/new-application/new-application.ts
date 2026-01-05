import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './new-application.html',
  styleUrl: './new-application.scss'
})
export class NewApplicationComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() applicationSubmitted = new EventEmitter<void>();

  currentStep = 1;
  totalSteps = 4;
  applicationForm!: FormGroup;
  uploadedDocuments: UploadedFile[] = [];

  districts = ['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'];
  regions = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Tanga'];
  currentClassifications = ['Local Road', 'District Road', 'Regional Road', 'National Road'];
  proposedClassifications = ['District Road', 'Regional Road', 'National Road', 'Trunk Road'];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      // Step 1: Basic Information
      roadName: ['', [Validators.required, Validators.minLength(3)]],
      district: ['', Validators.required],
      region: ['', Validators.required],
      roadLength: ['', [Validators.required, Validators.min(0.1)]],

      // Step 2: Classification
      currentClassification: ['', Validators.required],
      proposedClassification: ['', Validators.required],

      // Step 3: Details
      description: ['', [Validators.required, Validators.minLength(50)]],
      justification: ['', [Validators.required, Validators.minLength(50)]],
      trafficVolume: ['', Validators.min(0)],
      strategicImportance: [''],

      // Step 4: Documents (handled separately)
    });
  }

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
    // Allow going to previous steps only
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  isStepValid(): boolean {
    const step1Fields = ['roadName', 'district', 'region', 'roadLength'];
    const step2Fields = ['currentClassification', 'proposedClassification'];
    const step3Fields = ['description', 'justification'];

    switch (this.currentStep) {
      case 1:
        return step1Fields.every(field => this.applicationForm.get(field)?.valid);
      case 2:
        return step2Fields.every(field => this.applicationForm.get(field)?.valid);
      case 3:
        return step3Fields.every(field => this.applicationForm.get(field)?.valid);
      case 4:
        return this.uploadedDocuments.length >= 1; // At least one document required
      default:
        return false;
    }
  }

  markStepAsTouched(): void {
    const step1Fields = ['roadName', 'district', 'region', 'roadLength'];
    const step2Fields = ['currentClassification', 'proposedClassification'];
    const step3Fields = ['description', 'justification'];

    let fields: string[] = [];
    switch (this.currentStep) {
      case 1:
        fields = step1Fields;
        break;
      case 2:
        fields = step2Fields;
        break;
      case 3:
        fields = step3Fields;
        break;
    }

    fields.forEach(field => {
      this.applicationForm.get(field)?.markAsTouched();
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        this.uploadedDocuments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
      });
      // Reset input
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

  submitApplication(): void {
    if (this.applicationForm.valid && this.uploadedDocuments.length > 0) {
      console.log('Form Data:', this.applicationForm.value);
      console.log('Documents:', this.uploadedDocuments);

      // Mock submission - replace with actual API call
      setTimeout(() => {
        alert('Application submitted successfully!');
        this.resetForm();
        this.applicationSubmitted.emit();
        this.closeModal.emit();
      }, 1000);
    }
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      this.resetForm();
      this.closeModal.emit();
    }
  }

  onOverlayClick(event: Event): void {
    this.cancel();
  }

  resetForm(): void {
    this.currentStep = 1;
    this.applicationForm.reset();
    this.uploadedDocuments = [];
  }

  getStepIcon(step: number): string {
    if (step < this.currentStep) return 'check';
    return step.toString();
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
