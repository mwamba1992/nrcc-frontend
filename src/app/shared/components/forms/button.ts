import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="handleClick($event)"
    >
      <span class="btn-spinner" *ngIf="loading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </span>
      <ng-content *ngIf="!loading"></ng-content>
      <span *ngIf="loading && loadingText" class="loading-text">{{ loadingText }}</span>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      white-space: nowrap;
      border: 1.5px solid transparent;
      letter-spacing: 0.01em;
      position: relative;
      overflow: hidden;

      &:focus {
        outline: none;
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
    }

    // Sizes
    .btn-sm {
      padding: 8px 16px;
      font-size: 0.8125rem;
      min-height: 36px;
    }

    .btn-md {
      padding: 12px 24px;
      font-size: 0.875rem;
      min-height: 44px;
    }

    .btn-lg {
      padding: 14px 32px;
      font-size: 0.9375rem;
      min-height: 50px;
    }

    // Variants
    .btn-primary {
      background: linear-gradient(180deg, #059669 0%, #047857 100%);
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &:hover:not(:disabled) {
        background: linear-gradient(180deg, #047857 0%, #065f46 100%);
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        background: linear-gradient(180deg, #065f46 0%, #064e3b 100%);
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    }

    .btn-secondary {
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-color: #cbd5e1;
      color: #334155;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      &:hover:not(:disabled) {
        background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        border-color: #94a3b8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      }

      &:active:not(:disabled) {
        background: #f1f5f9;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    }

    .btn-outline {
      background: transparent;
      border-color: #059669;
      color: #059669;

      &:hover:not(:disabled) {
        background: rgba(5, 150, 105, 0.08);
        border-color: #047857;
        color: #047857;
      }

      &:active:not(:disabled) {
        background: rgba(5, 150, 105, 0.15);
      }
    }

    .btn-ghost {
      background: transparent;
      border-color: transparent;
      color: #64748b;

      &:hover:not(:disabled) {
        background: #f1f5f9;
        color: #334155;
      }

      &:active:not(:disabled) {
        background: #e2e8f0;
      }
    }

    .btn-danger {
      background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &:hover:not(:disabled) {
        background: linear-gradient(180deg, #b91c1c 0%, #991b1b 100%);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        background: linear-gradient(180deg, #991b1b 0%, #7f1d1d 100%);
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      &:focus-visible {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.3);
      }
    }

    // Full width
    .btn-full {
      width: 100%;
    }

    // Loading spinner
    .btn-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 1s linear infinite;

      svg {
        opacity: 0.9;
      }
    }

    .loading-text {
      opacity: 0.9;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingText = '';
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`
    ];

    if (this.fullWidth) {
      classes.push('btn-full');
    }

    return classes.join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
