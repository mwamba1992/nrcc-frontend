# Modal Component

A reusable, flexible modal component that can be used throughout the application.

## Features

- Multiple size options (sm, md, lg, xl, full)
- Content projection with slots (header, body, footer)
- Customizable close button
- Click outside to close
- ESC key to close
- Smooth animations
- Responsive design
- Accessibility support

## Basic Usage

### 1. Simple Modal with Title

```html
<app-modal
  [isOpen]="showModal"
  [title]="'Modal Title'"
  [size]="'md'"
  (closeModal)="onCloseModal()"
>
  <div modal-body>
    <p>Your modal content goes here.</p>
  </div>

  <div modal-footer>
    <button class="btn-secondary" (click)="onCloseModal()">Cancel</button>
    <button class="btn-primary" (click)="onSubmit()">Submit</button>
  </div>
</app-modal>
```

### 2. Custom Header

```html
<app-modal
  [isOpen]="showModal"
  [size]="'lg'"
  [showHeader]="true"
  (closeModal)="onCloseModal()"
>
  <div modal-header>
    <h2>Custom Header</h2>
    <p>With additional description</p>
  </div>

  <div modal-body>
    <p>Your modal content goes here.</p>
  </div>

  <div modal-footer>
    <button class="btn-cancel" (click)="onCloseModal()">Cancel</button>
    <button class="btn-primary" (click)="onSave()">Save</button>
  </div>
</app-modal>
```

### 3. Modal Without Footer

```html
<app-modal
  [isOpen]="showModal"
  [title]="'Information'"
  [showFooter]="false"
  (closeModal)="onCloseModal()"
>
  <div modal-body>
    <p>Information message here.</p>
    <button (click)="onCloseModal()">Got it</button>
  </div>
</app-modal>
```

### 4. Full Custom Modal (No Header/Footer)

```html
<app-modal
  [isOpen]="showModal"
  [size]="'xl'"
  [showHeader]="false"
  [showFooter]="false"
  (closeModal)="onCloseModal()"
>
  <div modal-body>
    <!-- Completely custom content -->
    <div class="custom-header">...</div>
    <div class="custom-body">...</div>
    <div class="custom-footer">...</div>
  </div>
</app-modal>
```

## Component Setup

### 1. Import the ModalComponent

```typescript
import { ModalComponent } from '@/shared/components/modal/modal';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './your-component.html',
  styleUrl: './your-component.scss'
})
export class YourComponent {
  showModal = false;

  openModal(): void {
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    // Handle submit logic
    this.showModal = false;
  }
}
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `title` | `string` | `''` | Modal title (only used if no custom header) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `showCloseButton` | `boolean` | `true` | Show/hide the X close button |
| `closeOnOverlayClick` | `boolean` | `true` | Allow closing by clicking overlay |
| `showFooter` | `boolean` | `true` | Show/hide footer section |
| `showHeader` | `boolean` | `true` | Show/hide header section |

## Output Events

| Event | Description |
|-------|-------------|
| `closeModal` | Emitted when modal should close |

## Size Options

- **sm**: 450px max-width - For confirmations, alerts
- **md**: 650px max-width - Default size for forms
- **lg**: 950px max-width - For complex forms, multi-step wizards
- **xl**: 1200px max-width - For data tables, galleries
- **full**: 96vw x 96vh - Nearly full-screen modals

## Content Slots

### modal-header
Custom header content. Use when you need more than just a title.

### modal-body
Main content area. This is where your primary content goes.

### modal-footer
Footer area, typically used for action buttons.

## Button Classes

The modal footer provides pre-styled button classes:

- `.btn-primary` - Primary action button (green)
- `.btn-secondary` - Secondary action button (gray outline)
- `.btn-cancel` - Cancel button (red on hover)
- `.btn-danger` - Destructive action button (red)

## Keyboard Support

- **ESC** - Closes the modal (if `closeOnOverlayClick` is true)

## Examples in Codebase

See `new-application` component for a real-world example of using the modal with a multi-step form.

```typescript
// In component
@Input() isOpen = false;
@Output() closeModal = new EventEmitter<void>();
@Output() applicationSubmitted = new EventEmitter<void>();

// In template
<app-modal
  [isOpen]="isOpen"
  [size]="'lg'"
  [showFooter]="false"
  [showHeader]="false"
  (closeModal)="cancel()"
>
  <div modal-body>
    <!-- Custom form content -->
  </div>
</app-modal>
```
