import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class.has-error]="hasError" [class.disabled]="disabled" [class.focused]="isFocused">
      <label *ngIf="label" [for]="textareaId" class="field-label">
        {{ label }}
        <span class="required-indicator" *ngIf="required">*</span>
      </label>
      <div class="textarea-container">
        <textarea
          [id]="textareaId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="onFocus()"
          (blur)="onBlurEvent()"
          [attr.maxlength]="maxLength"
          [attr.aria-describedby]="helpText ? textareaId + '-help' : null"
        ></textarea>
      </div>
      <div class="field-footer">
        <div class="footer-left">
          <span class="help-text" *ngIf="helpText && !hasError" [id]="textareaId + '-help'">
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
        <span class="char-count" *ngIf="showCharCount" [class.warning]="minLength && (value?.length || 0) < minLength" [class.success]="minLength && (value?.length || 0) >= minLength">
          <span class="count-current">{{ value?.length || 0 }}</span>
          <span *ngIf="minLength" class="count-target">/{{ minLength }} min</span>
          <span *ngIf="maxLength && !minLength" class="count-target">/{{ maxLength }}</span>
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

    .textarea-container {
      position: relative;
    }

    textarea {
      width: 100%;
      padding: 14px 16px;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.9375rem;
      color: #0f172a;
      background: #ffffff;
      resize: vertical;
      min-height: 100px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      line-height: 1.6;

      &::placeholder {
        color: #94a3b8;
        font-weight: 400;
      }

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
        resize: none;
      }
    }

    .field-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 8px;
      gap: 16px;
    }

    .footer-left {
      flex: 1;
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

    .char-count {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
      padding: 4px 10px;
      background: #f8fafc;
      border-radius: 6px;
      white-space: nowrap;

      .count-current {
        color: #64748b;
      }

      .count-target {
        color: #94a3b8;
      }

      &.warning {
        background: #fef3c7;

        .count-current {
          color: #d97706;
        }

        .count-target {
          color: #f59e0b;
        }
      }

      &.success {
        background: #dcfce7;

        .count-current {
          color: #16a34a;
        }

        .count-target {
          color: #22c55e;
        }
      }
    }

    .has-error {
      textarea {
        border-color: #dc2626;
        background: #fef2f2;

        &::placeholder {
          color: #f87171;
        }

        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
      }
    }

    .disabled {
      textarea {
        background: #f8fafc;
        cursor: not-allowed;
      }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() rows = 4;
  @Input() helpText = '';
  @Input() errorMessage = '';
  @Input() hasError = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() showCharCount = false;

  textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;
  value: string = '';
  isFocused = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value || '';
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
