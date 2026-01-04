# NRCC Database Management System - Project Structure

## Overview
This is the frontend application for the National Road Classification Committee (NRCC) Database Management System for Tanzania Roads Fund Board.

## Technology Stack
- **Framework**: Angular 21
- **Styling**: SCSS with custom design system
- **Package Manager**: npm
- **Node Version**: 22.20.0

## Design System
The application uses a custom design system based on:
- **Tanzania Official Colors**: Green (#1EB53A), Blue (#00A3DD), Gold (#FCD116)
- **Modern UI Components**: Clean, professional government portal aesthetic
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes

## Project Structure

```
nrcc-system/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality (singleton services, guards, interceptors)
│   │   │   ├── guards/              # Route guards (auth, role-based access)
│   │   │   ├── interceptors/        # HTTP interceptors (auth token, error handling)
│   │   │   ├── services/            # Core services (auth, api, notification)
│   │   │   └── models/              # Core data models and interfaces
│   │   │
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   │   ├── auth/                # Authentication (login, logout, password reset)
│   │   │   ├── applications/        # Road reclassification applications module
│   │   │   ├── dashboard/           # Dashboard and analytics
│   │   │   ├── admin/               # Admin panel (users, roles, system config)
│   │   │   ├── action-plans/        # NRCC Action Plan Management
│   │   │   └── reports/             # Reports and exports
│   │   │
│   │   ├── shared/                  # Shared resources
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── directives/          # Custom directives
│   │   │   ├── pipes/               # Custom pipes
│   │   │   └── utils/               # Utility functions and helpers
│   │   │
│   │   ├── app.ts                   # Root component
│   │   ├── app.config.ts            # App configuration
│   │   └── app.routes.ts            # Route definitions
│   │
│   ├── styles/                      # Global styles and design system
│   │   ├── variables.scss           # Design tokens (colors, typography, spacing)
│   │   └── mixins.scss              # SCSS mixins and utilities
│   │
│   ├── styles.scss                  # Global stylesheet entry point
│   └── index.html                   # Main HTML file
│
├── public/                          # Static assets
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript configuration
```

## Feature Modules

### 1. Authentication (`features/auth`)
- Login page with modern design
- User authentication and session management
- Password reset functionality
- Role-based access control

### 2. Applications (`features/applications`)
- Online application form (Fourth Schedule compliance)
- Eligibility validation (Regional R1-R7, Trunk T1-T5 criteria)
- Document upload and management
- Application workflow tracking
- Status updates and notifications

### 3. Dashboard (`features/dashboard`)
- Overview statistics and KPIs
- Recent applications
- Workflow status visualization
- Quick actions and notifications

### 4. Action Plans (`features/action-plans`)
- Annual action plan creation and management
- Targets and activities tracking
- Quarterly scheduling (Q1-Q4)
- Budget estimation and tracking
- Implementation progress monitoring

### 5. Admin (`features/admin`)
- User management
- Role and permission configuration
- System settings
- Audit logs

### 6. Reports (`features/reports`)
- Application status reports
- Processing time analytics
- Regional/classification breakdowns
- Export to PDF/Excel

## Design System

### Color Palette

#### Primary Colors
- **Green**: `#1EB53A` - Primary actions, success states
- **Blue**: `#00A3DD` - Links, info, primary gradient
- **Gold**: `#FCD116` - Warnings, highlights
- **Black**: `#000000` - Text, borders

#### Semantic Colors
- **Success**: Green `#1EB53A`
- **Info**: Blue `#00A3DD`
- **Warning**: Gold `#FCD116`
- **Danger**: Red `#DC3545`

### Typography
- **Font Family**: Inter (body), Roboto (headings)
- **Base Size**: 16px
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px

### Spacing Scale
- Based on 4px increments: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px

### Components
- **Cards**: Rounded corners (12px), shadow effects, hover states
- **Buttons**: Multiple variants (primary, success, outline), sizes (sm, md, lg)
- **Forms**: Modern inputs with focus states, validation feedback
- **Tables**: Hover effects, striped rows, responsive
- **Badges**: Status indicators with semantic colors

## Development

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Build
```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Run Tests
```bash
npm test
```

## User Roles & Permissions

1. **Public Applicant** - Submit applications, track status, submit appeals
2. **Regional Roads Board Initiator** - Create board applications
3. **RAS (Regional Administrative Secretary)** - Review/approve regional applications
4. **Regional Commissioner** - Final regional approval
5. **Minister of Works** - Final decision authority
6. **NRCC Chairperson** - Assign verifications, compile recommendations
7. **NRCC Member** - Conduct site verifications
8. **NRCC Secretariat** - Administrative support, meeting management
9. **Ministry Lawyer** - Gazettement tracking
10. **System Administrator** - User management, system configuration

## Workflow Overview

### Workflow A: Public Applications
Public/MP/Group → Minister → NRCC Chair → Verification → Recommendation → Decision

### Workflow B: Regional Roads Board
Initiator → RAS → RC → Minister → NRCC Chair → Verification → Recommendation → Decision

### Workflow C: NRCC Process
Chair assigns → Members verify → Meeting & recommendation → Minister decision

### Workflow D: Outcomes
Approved → Lawyer → Gazettement
Refused → Appeal option

## Next Steps

1. **Implement Authentication Module**
   - Login page matching reference design
   - JWT token management
   - Route guards

2. **Create Shared Components**
   - Header/Navigation
   - Sidebar
   - Card components
   - Form components
   - Data tables

3. **Build Application Module**
   - Application form wizard
   - Eligibility validation
   - Document upload
   - Workflow tracking

4. **Develop Dashboard**
   - Statistics cards
   - Recent applications list
   - Status charts

5. **Backend Integration**
   - API service setup
   - HTTP interceptors
   - Error handling
   - State management (consider NgRx or signals)

## Resources
- [Angular Documentation](https://angular.dev)
- [Tanzania Roads Fund Board](https://www.roadsfund.go.tz)
- SRS Document: Software Requirements Specifications for NRCC Database Management System
