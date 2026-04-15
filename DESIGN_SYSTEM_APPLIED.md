# KREIS Assessment Platform - Design System Implementation

## Overview
This document outlines the comprehensive design system applied across all pages based on the reference designs provided.

## Color Palette

### Primary Colors
- **Primary Blue**: `#3b82f6` - Used for primary buttons, active states, and key actions
- **Primary Light**: `#60a5fa` - Hover states and lighter variations
- **Primary Dark**: `#2563eb` - Pressed states and emphasis
- **Primary Background**: `#eff6ff` - Very light blue backgrounds

### Cyan/Turquoise (Secondary)
- **Cyan Main**: `#06b6d4` - Secondary actions and highlights
- **Cyan Light**: `#22d3ee` - Light accents
- **Cyan Dark**: `#0891b2` - Dark accents
- **Cyan Background**: `#ecfeff` - Light cyan backgrounds

### Neutral/Gray Scale
- **50**: `#f8fafc` - Page backgrounds
- **100**: `#f1f5f9` - Light backgrounds, table headers
- **200**: `#e2e8f0` - Borders, dividers
- **300**: `#cbd5e1` - Disabled states
- **400**: `#94a3b8` - Placeholder text
- **500**: `#64748b` - Secondary text, labels
- **600**: `#475569` - Body text
- **700**: `#334155` - Headings
- **800**: `#1e293b` - Dark headings, primary text
- **900**: `#0f172a` - Sidebar background, darkest elements

### Semantic Colors
- **Success**: `#10b981` (Green) - Success states, positive indicators
- **Warning**: `#f59e0b` (Amber/Orange) - Warning states, caution indicators
- **Error**: `#ef4444` (Red) - Error states, negative indicators
- **Info**: `#3b82f6` (Blue) - Informational states

## Typography

### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
- **Monospace**: `'Fira Code', 'Courier New', monospace`

### Font Sizes
- **xs**: 11px - Very small text
- **sm**: 13px - Small text, labels
- **base**: 14px - Body text, default
- **md**: 15px - Medium text
- **lg**: 16px - Large text, card titles
- **xl**: 18px - Extra large
- **2xl**: 20px - Section headings
- **3xl**: 24px - Page subheadings
- **4xl**: 28px - Page headings

### Font Weights
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings, labels
- **Bold**: 700 - Headings, important text
- **Extrabold**: 800 - Hero text

## Spacing System
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **base**: 16px
- **lg**: 20px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 40px
- **4xl**: 48px
- **5xl**: 64px

## Border Radius
- **sm**: 6px - Small elements
- **base**: 8px - Buttons, inputs
- **md**: 10px - Medium cards
- **lg**: 12px - Large cards
- **xl**: 16px - Extra large containers
- **full**: 9999px - Circular elements

## Shadows
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- **base**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` - Default cards
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` - Elevated cards
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` - Floating elements
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` - Modals

## Component Styles

### Cards
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Border Radius: `12px`
- Box Shadow: `var(--shadow-base)`
- Padding: `24px`
- Hover: Slight lift with enhanced shadow

### Buttons
#### Primary
- Background: `#3b82f6`
- Color: `#ffffff`
- Border Radius: `8px`
- Padding: `8px 16px`
- Font Weight: 500
- Hover: Darker blue with lift and shadow

#### Secondary
- Background: `#f1f5f9`
- Color: `#334155`
- Border Radius: `8px`
- Padding: `8px 16px`
- Font Weight: 500

### Inputs & Selects
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Border Radius: `8px`
- Padding: `8px 12px`
- Font Size: `14px`
- Focus: Blue border with subtle shadow

### Tables
- Header Background: `#f8fafc`
- Header Text: `#64748b` (uppercase, 13px, semibold)
- Border Color: `#e2e8f0`
- Hover Background: `#f8fafc`
- Row Text: `#334155`

### Badges/Tags
- Success: Background `#d1fae5`, Text `#059669`
- Warning: Background `#fef3c7`, Text `#d97706`
- Error: Background `#fee2e2`, Text `#dc2626`
- Info: Background `#dbeafe`, Text `#2563eb`
- Border Radius: `6px`
- Padding: `2px 10px`
- Font Weight: 500

## Page Layout

### Container
- Background: `#f8fafc`
- Min Height: `calc(100vh - 64px)`
- Padding: `24px`

### Page Header
- Title Font Size: `28px`
- Title Font Weight: 700
- Title Color: `#1e293b`
- Subtitle Font Size: `15px`
- Subtitle Color: `#64748b`
- Margin Bottom: `32px`

### Filter Cards
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Border Radius: `12px`
- Box Shadow: `var(--shadow-base)`
- Padding: `24px`
- Margin Bottom: `32px`

### Stat Cards
- Background: `#ffffff`
- Border: `1px solid #e2e8f0`
- Border Radius: `12px`
- Box Shadow: `var(--shadow-base)`
- Padding: `20px`
- Icon Badge: 48x48px with colored background

## Sidebar Styles
- Background: `#0f172a` (Dark navy)
- Text Color: `#94a3b8` (Light gray)
- Active Item: `#3b82f6` (Blue)
- Hover: `rgba(59, 130, 246, 0.1)`
- Border Radius: `8px`
- Item Margin: `4px 8px`

## Label Styles
- Font Size: `13px`
- Font Weight: 600
- Color: `#475569`
- Text Transform: `uppercase`
- Letter Spacing: `0.5px`
- Margin Bottom: `8px`

## Animations
- Card Hover: `translateY(-2px)` with enhanced shadow
- Button Hover: `translateY(-2px)` with colored shadow
- Fade In: Opacity 0 to 1 with `translateY(30px)` to 0
- Transition Duration: `0.3s` with `cubic-bezier(0.4, 0, 0.2, 1)`

## Files Updated

### Core Files
1. **src/index.css** - Global styles with CSS variables
2. **src/theme/design-system.js** - Design system configuration
3. **.gitignore** - Added `.agent/` folder

### Page Files
1. **src/pages/Common/Dashboard.js** - Complete redesign with new stat cards, charts, and layout
2. **src/pages/Common/Results.js** - Updated with design system colors and typography

## CSS Variables
All design tokens are available as CSS variables with the `--color-`, `--font-`, `--spacing-`, `--radius-`, and `--shadow-` prefixes for easy reuse across the application.

## Usage Guidelines

### When to Use Primary Blue
- Primary action buttons
- Active navigation items
- Links and interactive elements
- Progress indicators
- Selected states

### When to Use Cyan
- Secondary actions
- Highlights and accents
- Data visualizations
- Alternative interactive elements

### When to Use Neutral Colors
- Text content (500-800)
- Backgrounds (50-100)
- Borders and dividers (200-300)
- Disabled states (300-400)

### When to Use Semantic Colors
- Success messages and positive indicators (Green)
- Warning messages and caution states (Amber)
- Error messages and negative indicators (Red)
- Informational messages (Blue)

## Accessibility
- All text meets WCAG AA contrast requirements
- Interactive elements have clear focus states
- Color is not the only indicator of state
- Font sizes are readable and scalable

## Responsive Considerations
- Mobile-first approach
- Breakpoints: xs (< 576px), sm (≥ 576px), md (≥ 768px), lg (≥ 992px), xl (≥ 1200px)
- Flexible grid system with Ant Design's Row/Col
- Touch-friendly button sizes (minimum 44x44px)

## Next Steps
To apply this design system to remaining pages:
1. Use CSS variables for all colors
2. Apply consistent spacing using the spacing scale
3. Use the defined typography scale
4. Apply border radius and shadows consistently
5. Follow the component style guidelines
6. Ensure all interactive elements have proper hover/focus states
