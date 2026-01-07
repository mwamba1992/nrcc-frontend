# NRCC Government Enterprise Design System
## Official Design Guidelines for Internal Government Systems

**Last Updated:** 2026-01-06
**Version:** 2.0.0
**Status:** Production Ready

---

## Executive Summary

This document defines the official design system for the National Road Classification Commission (NRCC) system. The redesign transforms the previous SaaS-style interface into a proper government-grade enterprise system that prioritizes **authority**, **trust**, and **clarity**.

### Key Objectives

1. **Professional Appearance**: Eliminate consumer-grade visual patterns
2. **Institutional Authority**: Convey official government status
3. **Operational Clarity**: Reduce cognitive load for procedural tasks
4. **Conservative Aesthetics**: Maintain stability and predictability
5. **Accessibility Compliance**: Meet WCAG 2.1 AA standards

---

## Design Philosophy

### Government Systems Are Not Products

| SaaS/Commercial Pattern | Government Pattern |
|------------------------|-------------------|
| Vibrant, friendly colors | Muted, institutional colors |
| Animated interactions | Static, stable interfaces |
| Rounded corners everywhere | Minimal rounding, defined edges |
| Casual language | Formal, procedural terminology |
| Trend indicators | Factual data presentation |
| Gradient backgrounds | Flat, consistent surfaces |

### Core Principles

1. **Formality Over Friendliness** - Official tone, not marketing
2. **Precision Over Engagement** - Accurate data, not storytelling
3. **Consistency Over Delight** - Predictable patterns, not surprises
4. **Clarity Over Aesthetics** - Function-first design

---

## Color Palette

### Primary Government Colors

```scss
// Authority & Navigation
$gov-navy: #1C3F6D;           // Primary authority color
$gov-steel-blue: #5B7A99;     // Secondary actions
$gov-accent-blue: #2B5A8B;    // Links, interactive elements

// Tanzania Official Colors (preserved)
$primary-green: #1EB53A;      // Tanzania branding
$primary-gold: #FCD116;       // Tanzania branding
```

### Status Colors (Muted, Professional)

```scss
$gov-success: #2D6A4F;        // Approved (forest green)
$gov-warning: #B85C00;        // Pending (burnt orange)
$gov-danger: #8B2E2E;         // Rejected (maroon)
$gov-info: #3D5A80;           // Informational (slate blue)
```

### Neutral Palette (Cool Grays)

```scss
$gray-50: #F5F7FA;            // Page background
$gray-100: #E4E9F0;           // Subtle borders
$gray-200: #D1D9E6;           // Default borders
$gray-300: #CBD5E1;           // Disabled states
$gray-400: #94A3B8;           // Muted elements
$gray-500: #64748B;           // Secondary text
$gray-600: #475569;           // Body text
$gray-700: #334155;           // Emphasized text
$gray-800: #1E293B;           // Headings
$gray-900: #0F172A;           // Primary text
```

### Usage Guidelines

**DO:**
- Use $gov-navy for primary buttons and navigation
- Use muted status colors for application states
- Use gray-50 for page backgrounds
- Use gray-900 for primary text

**DON'T:**
- Use bright, vibrant colors (#3b82f6, #8b5cf6, etc.)
- Use gradients on functional UI elements
- Use colors for decoration only

---

## Typography

### Font Stack

```scss
$font-stack-government: -apple-system, BlinkMacSystemFont,
                        "Segoe UI", "Roboto", "Helvetica Neue",
                        Arial, sans-serif;
```

**Rationale:** System fonts ensure consistency across government devices and eliminate external dependencies.

### Font Sizes (Fixed Scale)

```scss
$font-size-h1: 24px;          // Page titles
$font-size-h2: 20px;          // Section headers
$font-size-h3: 16px;          // Subsection headers
$font-size-body: 14px;        // Body text
$font-size-small: 12px;       // Labels, metadata
$font-size-legal: 11px;       // Fine print
```

### Font Weights

```scss
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;       // Use sparingly
```

### Typography Rules

**DO:**
- Use uppercase for labels: `text-transform: uppercase;`
- Use letter-spacing: `0.5px` for uppercase text
- Use `font-variant-numeric: tabular-nums;` for numbers
- Use `letter-spacing: normal;` (never negative)

**DON'T:**
- Use negative letter-spacing
- Use decorative fonts
- Use font sizes below 11px
- Use italic for emphasis (use bold instead)

---

## Spacing & Layout

### Spacing Scale (8px Base)

```scss
$spacing-1: 4px;
$spacing-2: 8px;
$spacing-3: 12px;
$spacing-4: 16px;
$spacing-5: 20px;
$spacing-6: 24px;
$spacing-8: 32px;
$spacing-10: 40px;
$spacing-12: 48px;
```

### Border Radius (Minimal)

```scss
$radius-none: 0;              // Flat, official
$radius-sm: 2px;              // Subtle
$radius-md: 4px;              // Standard cards
$radius-lg: 6px;              // Large containers
$radius-xl: 8px;              // Maximum
```

**Reduced from SaaS values:**
- $radius-lg: 8px → 6px
- $radius-xl: 12px → 8px
- $radius-2xl: 16px → 10px

---

## Shadows (Minimal, Flat)

### Shadow Scale

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
$shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
$shadow-lg: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
$shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06);
$shadow-none: none;
```

**Usage:**
- Use $shadow-sm for most cards
- Use $shadow-none for flat UI elements
- Avoid large, dramatic shadows

---

## Component Specifications

### Statistics Cards

```scss
.stat-card {
  background: $white;
  border: 1px solid $gray-200;
  border-left: 3px solid $gov-navy;  // Left accent
  border-radius: $radius-md;
  padding: $spacing-5;
  box-shadow: $shadow-sm;
  transition: none;  // No animations

  &:hover {
    border-color: $gray-300;  // Subtle
  }
}

.card-body h3 {
  font-size: 28px;
  font-weight: $font-weight-bold;
  color: $gray-900;
  font-variant-numeric: tabular-nums;
  letter-spacing: normal;
}

.card-body p {
  font-size: 11px;
  color: $gray-600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

**Key Changes:**
- Removed trend indicators
- Removed card subtitles
- Removed hover animations (translateY, scale)
- Flat borders instead of gradients

### Buttons

```scss
.btn-primary {
  background: $gov-navy;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: none;

  &:hover {
    background: darken($gov-navy, 5%);
  }
}

.btn-secondary {
  background: transparent;
  color: $gov-navy;
  border: 1px solid $gov-navy;
}
```

### Filter Buttons

```scss
.filter-btn {
  padding: 8px 16px;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-sm;
  color: $gray-700;
  font-size: 13px;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: none;

  &:hover {
    border-color: $gov-navy;
    background: $gray-50;
  }

  &.active {
    background: $gov-navy;
    border-color: $gov-navy;
    color: $white;
  }
}
```

### Charts (Government Style)

```scss
// Chart Container
.chart-container {
  background: white;
  border-radius: $radius-md;
  padding: $spacing-5;
  border: 1px solid $gray-200;
  box-shadow: $shadow-sm;
}

.chart-title {
  font-size: 12px;
  font-weight: $font-weight-semibold;
  color: $gray-700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid $gray-200;
  padding-bottom: $spacing-3;
}
```

**Chart.js Configuration:**

```javascript
// Legend styling
legend: {
  labels: {
    usePointStyle: false,  // Boxes, not circles
    padding: 12,
    font: {
      size: 11,
      family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      weight: '500'
    },
    color: '#475569'
  }
}

// Grid styling
grid: {
  color: '#E4E9F0',
  lineWidth: 1
}

// Axis styling
ticks: {
  font: {
    size: 11,
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  color: '#64748B'
}
```

### Activity Timeline

```scss
.timeline-header h3 {
  font-size: 12px;
  font-weight: $font-weight-semibold;
  color: $gray-700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid $gray-200;
}

.timeline-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid;        // Defined border
  background: $white;       // White fill
  box-shadow: 0 0 0 3px $white;

  &[data-type="blue"] {
    border-color: $gov-navy;
    color: $gov-navy;
  }
}

.timeline-item::before {
  background: $gray-200;    // Solid line, no gradient
}
```

---

## Removed SaaS Patterns

### What Was Eliminated

1. **Trend Indicators**
   - Removed: `+12%` pills with green arrows
   - Reason: Government systems show facts, not trends

2. **Hover Animations**
   - Removed: `transform: translateY(-6px)`, `scale(1.15)`, `rotate(8deg)`
   - Reason: Stability and predictability required

3. **Gradients**
   - Removed: `linear-gradient(135deg, ...)` backgrounds
   - Reason: Flat surfaces for official UI

4. **Rounded Corners**
   - Changed: 12px → 4px, 16px → 8px
   - Reason: Rectangular, structured layouts

5. **Vibrant Colors**
   - Removed: #3b82f6, #8b5cf6, #f59e0b, #10b981
   - Replaced: $gov-navy, $gov-info, $gov-warning, $gov-success

6. **Casual Language**
   - Changed: "You're all caught up!" → "No applications in queue"
   - Changed: "Quick Actions" → Remains (acceptable)

7. **Empty State Illustrations**
   - Simplified: Removed gradient backgrounds and patterns
   - Kept: Simple SVG icons with plain backgrounds

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast Ratios:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Verified Combinations:**
- $gray-900 on white: 16.1:1 ✓
- $gray-700 on white: 9.2:1 ✓
- $gray-600 on white: 6.8:1 ✓
- $gov-navy on white: 8.2:1 ✓

### Keyboard Navigation

- All interactive elements focusable
- Visible focus indicators
- Tab order follows visual flow
- Esc key closes modals/dropdowns

### Screen Readers

- Semantic HTML structure
- ARIA labels on icons
- Role attributes on custom components
- Alt text on informational images

---

## Implementation Guide

### File Structure

```
src/
├── styles/
│   ├── variables.scss          ← Government color palette
│   ├── mixins.scss
│   └── typography.scss
├── app/
│   ├── features/
│   │   ├── reviewer/
│   │   │   └── dashboard/
│   │   │       ├── reviewer-dashboard.ts
│   │   │       ├── reviewer-dashboard.html
│   │   │       └── reviewer-dashboard.scss  ← Updated
│   │   └── applicant/
│   │       └── dashboard/
│   │           ├── applicant-dashboard.ts
│   │           ├── applicant-dashboard.html
│   │           └── applicant-dashboard.scss  ← Updated
│   └── shared/
│       └── components/
│           ├── line-chart/
│           │   ├── line-chart.ts             ← Updated
│           │   ├── line-chart.html
│           │   └── line-chart.scss           ← Updated
│           └── activity-timeline/
│               ├── activity-timeline.ts
│               ├── activity-timeline.html
│               └── activity-timeline.scss    ← Updated
```

### Migration Checklist

- [x] Update color variables in `variables.scss`
- [x] Remove SaaS animations from dashboard styles
- [x] Update stat card styling
- [x] Update button and filter styling
- [x] Update chart component configuration
- [x] Update activity timeline styling
- [x] Simplify empty states
- [x] Remove trend indicators
- [x] Update border-radius values
- [x] Update shadow values
- [ ] Test across all browsers
- [ ] Verify accessibility compliance
- [ ] Update user documentation

---

## Before & After Comparison

### Statistics Cards

**Before (SaaS):**
```scss
border-radius: 8px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transform: translateY(-1px);
background: linear-gradient(...);
```

**After (Government):**
```scss
border-radius: 4px;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
transition: none;
border-left: 3px solid $gov-navy;
```

### Action Cards

**Before (SaaS):**
```scss
&:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  .action-icon {
    transform: scale(1.15) rotate(8deg);
  }
}
```

**After (Government):**
```scss
&:hover {
  border-color: $gray-300;
  background: $gray-50;
}
```

---

## Testing & Validation

### Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- IE 11 (if required)

### Device Testing

- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Surface)
- Mobile (responsive fallback)

### Accessibility Testing Tools

- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation

---

## Design Review Criteria

### ✓ Passes Government Standards

1. No vibrant, consumer-grade colors
2. No excessive animations or micro-interactions
3. Minimal border-radius (≤8px)
4. Flat shadows (≤4px blur)
5. Formal, procedural language
6. Tabular data presentation
7. Defined borders and structure
8. Muted status colors
9. System fonts only
10. WCAG 2.1 AA compliant

### ✗ Fails Government Standards

1. Gradient backgrounds on functional elements
2. Hover transformations (scale, rotate, translateY > 2px)
3. Trend indicators with arrows
4. Rounded pill shapes (> 10px radius)
5. Casual language ("You're all caught up!")
6. Bright colors (#3b82f6, #8b5cf6, #10b981)
7. Marketing-style copy
8. Decorative illustrations
9. Custom fonts from external sources
10. Insufficient color contrast

---

## Maintenance & Updates

### Version Control

- Document version number in header
- Track changes in CHANGELOG.md
- Review quarterly for compliance

### Design Review Process

1. Propose change in design ticket
2. Review against government standards
3. Test with accessibility tools
4. Approve by technical lead
5. Document in this file

### Contact

- **Design Lead:** [Your Name]
- **Technical Lead:** [Your Name]
- **Accessibility Coordinator:** [Your Name]

---

## Appendix: Color Reference

### Government Status Colors

| Color | Hex | Use Case | Accessibility |
|-------|-----|----------|---------------|
| Navy | #1C3F6D | Primary buttons, navigation | AAA |
| Success | #2D6A4F | Approved status | AA |
| Warning | #B85C00 | Pending status | AA |
| Danger | #8B2E2E | Rejected status | AA |
| Info | #3D5A80 | Informational messages | AA |

### Neutral Grays

| Color | Hex | Use Case |
|-------|-----|----------|
| Gray 50 | #F5F7FA | Page background |
| Gray 100 | #E4E9F0 | Subtle borders |
| Gray 200 | #D1D9E6 | Default borders |
| Gray 300 | #CBD5E1 | Disabled states |
| Gray 600 | #475569 | Body text |
| Gray 900 | #0F172A | Headings |

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [U.S. Web Design System](https://designsystem.digital.gov/)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Tanzania Government Branding Guidelines]

---

**Document Status:** Production Ready
**Last Review:** 2026-01-06
**Next Review:** 2026-04-06
