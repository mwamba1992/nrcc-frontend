import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showCloseButton = true;
  @Input() closeOnOverlayClick = true;
  @Input() showFooter = true;
  @Input() showHeader = true;
  @Input() hasHeaderContent = false;

  @Output() closeModal = new EventEmitter<void>();

  onOverlayClick(): void {
    if (this.closeOnOverlayClick) {
      this.closeModal.emit();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.isOpen) {
      this.onClose();
    }
  }
}
