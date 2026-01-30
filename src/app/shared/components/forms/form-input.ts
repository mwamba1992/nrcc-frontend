import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class.has-error]="hasError" [class.disabled]="disabled" [class.focused]="isFocused">
      <label *ngIf="label" [for]="inputId" class="field-label">
        {{ label }}
        <span class="required-indicator" *ngIf="required">*</span>
      </label>
      <div class="input-container">
        <div class="input-prefix" *ngIf="prefix">
          <span>{{ prefix }}</span>
        </div>
        <input
          [type]="type"
          [id]="inputId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="onFocus()"
          (blur)="onBlurEvent()"
          [attr.min]="min"
          [attr.max]="max"
          [attr.step]="step"
          [attr.aria-describedby]="helpText ? inputId + '-help' : null"
        />
        <div class="input-suffix" *ngIf="suffix">
          <span>{{ suffix }}</span>
        </div>
      </div>
      <div class="field-footer" *ngIf="helpText || (hasError && errorMessage)">
        <span class="help-text" *ngIf="helpText && !hasError" [id]="inputId + '-help'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          {{ helpText }}
        </span>
        <span class="error-text" *ngIf="hasError && errorMessage">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ errorMessage }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
      letter-spacing: 0.01em;
      line-height: 1.4;
    }

    .required-indicator {
      color: #dc2626;
      font-weight: 500;
    }

    .input-container {
      display: flex;
      align-items: stretch;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      min-height: 46px;
    }

    .form-field:not(.disabled):not(.has-error) .input-container:hover {
      border-color: #94a3b8;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .form-field.focused:not(.has-error) .input-container {
      border-color: #059669;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      font-size: 0.9375rem;
      color: #0f172a;
      background: transparent;
      outline: none;
      font-family: inherit;
      line-height: 1.5;
      min-width: 0;

      &::placeholder {
        color: #94a3b8;
        font-weight: 400;
      }

      &:disabled {
        color: #64748b;
        cursor: not-allowed;
        -webkit-text-fill-color: #64748b;
      }
    }

    .input-prefix,
    .input-suffix {
      display: flex;
      align-items: center;
      padding: 0 14px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      white-space: nowrap;
      border-color: #e2e8f0;
    }

    .input-prefix {
      border-right: 1.5px solid #e2e8f0;
      padding-left: 14px;
    }

    .input-suffix {
      border-left: 1.5px solid #e2e8f0;
      padding-right: 14px;
    }

    .field-footer {
      display: flex;
      align-items: flex-start;
      margin-top: 8px;
    }

    .help-text,
    .error-text {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      line-height: 1.4;

      svg {
        flex-shrink: 0;
        opacity: 0.7;
      }
    }

    .help-text {
      color: #64748b;
    }

    .error-text {
      color: #dc2626;
      font-weight: 500;
    }

    .has-error .input-container {
      border-color: #dc2626;
      background: #fef2f2;

      input::placeholder {
        color: #f87171;
      }
    }

    .has-error.focused .input-container {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .disabled .input-container {
      background: #f8fafc;
      border-color: #e2e8f0;
      cursor: not-allowed;
    }

    /* Number input spinner styling */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      opacity: 0.5;
      height: 32px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'tel' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() helpText = '';
  @Input() errorMessage = '';
  @Input() hasError = false;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;

  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  value: any = '';
  isFocused = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlurEvent(): void {
    this.isFocused = false;
    this.onTouched();
  }
}
