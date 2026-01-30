import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class.has-error]="hasError" [class.disabled]="disabled" [class.focused]="isFocused">
      <label *ngIf="label" [for]="selectId" class="field-label">
        {{ label }}
        <span class="required-indicator" *ngIf="required">*</span>
      </label>
      <div class="select-container">
        <select
          [id]="selectId"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="onFocus()"
          (blur)="onBlurEvent()"
          [attr.aria-describedby]="helpText ? selectId + '-help' : null"
        >
          <option value="" *ngIf="placeholder" disabled>{{ placeholder }}</option>
          <option
            *ngFor="let option of options"
            [value]="option.value"
            [disabled]="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
        <div class="select-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      <div class="field-footer" *ngIf="helpText || (hasError && errorMessage)">
        <span class="help-text" *ngIf="helpText && !hasError" [id]="selectId + '-help'">
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

    .select-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    select {
      width: 100%;
      padding: 12px 48px 12px 16px;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.9375rem;
      color: #0f172a;
      background: #ffffff;
      cursor: pointer;
      appearance: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      line-height: 1.5;
      min-height: 46px;

      &:hover:not(:disabled) {
        border-color: #94a3b8;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      &:focus {
        outline: none;
        border-color: #059669;
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      &:disabled {
        background: #f8fafc;
        border-color: #e2e8f0;
        color: #64748b;
        cursor: not-allowed;
      }

      option {
        color: #0f172a;
        padding: 12px;
        font-size: 0.9375rem;

        &:disabled {
          color: #94a3b8;
        }
      }
    }

    .select-icon {
      position: absolute;
      right: 14px;
      pointer-events: none;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .form-field.focused .select-icon {
      color: #059669;
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

    .has-error select {
      border-color: #dc2626;
      background: #fef2f2;

      &:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
      }
    }

    .has-error .select-icon {
      color: #dc2626;
    }

    .disabled select {
      background: #f8fafc;
      cursor: not-allowed;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() options: SelectOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() helpText = '';
  @Input() errorMessage = '';
  @Input() hasError = false;

  selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
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
