# KREIS Assessment Application - Design Mockup Prompts

## Application Overview
KREIS Assessment is a modern educational assessment platform for managing and analyzing test results across institutes, principals (branches), and students. The application features role-based dashboards, test management, and detailed analytics.

---

## 1. Login Screen

**Prompt:**
```
Create a modern, professional login screen for an educational assessment platform called "KREIS Assessment". 

Design specifications:
- Centered login card (450px width) with white background
- Gradient purple background (from #667eea to #764ba2)
- Large "K" logo in a rounded square with gradient background at the top
- "KREIS Assessment" title in bold, modern font
- "Sign in to your account" subtitle in gray
- Two input fields: Username and Password with icons
- Large blue gradient "Sign In" button with icon
- Clean, minimal design with ample white space
- Subtle shadows and rounded corners (12px border radius)
- Modern, professional aesthetic
- Footer text: "© 2024 KREIS Assessment. All rights reserved."

Style: Modern, clean, professional, educational
Colors: Purple gradient (#667eea, #764ba2), white, blue accents
```

---

## 2. Dashboard - Overview Screen

**Prompt:**
```
Create a modern dashboard overview screen for an educational assessment platform.

Layout:
- Fixed dark sidebar (200px) on the left with "KREIS" logo and menu items
- Top header bar with page title "Dashboard", notification bell, and user avatar
- Main content area with light gray background (#f0f2f5)

Content sections:
1. Filter Section (top):
   - Dropdown filters in a white card: Institute, Category, Test, View By
   - Modern select dropdowns with icons
   - Clean spacing between filters

2. Statistics Cards (4 cards in a row):
   - Total Submissions (green icon, user icon)
   - Average Score (blue icon, trophy icon)
   - Highest Score (green icon, up arrow)
   - Lowest Score (red icon, down arrow)
   - Each card: white background, colored icon circle, large number, label
   - Rounded corners, subtle shadows

3. Charts Section (2 columns):
   - Left: Score Distribution (colorful pie chart)
   - Right: Branch-wise Performance (green bar chart)
   - Both in white cards with titles

4. Bottom Section (2 columns):
   - Top Performers (horizontal bar chart, blue gradient)
   - Additional metrics or charts

Style: Modern, clean, data-focused, professional
Colors: Blue (#1890ff), green (#52c41a), red (#ff4d4f), white, light gray background
Typography: Clean sans-serif, bold headings
```

---

## 3. Test Results Screen

**Prompt:**
```
Create a modern test results screen showing student submissions and detailed analytics.

Layout:
- Same sidebar and header as dashboard
- Page title: "Test Results" with subtitle
- "Download Excel" button in top right (blue, with download icon)

Content sections:
1. Filter Card (top):
   - "Filters" section with filter icon
   - Dropdowns: Institute, Category, Test, Search Student, Principal, Branch
   - Modern select components with proper spacing
   - White card with rounded corners

2. Results Table:
   - White card containing data table
   - Columns: Student Name, Batch, Principal, Scored Marks, Total Marks, Percentage, Correct, Incorrect, Skipped, Submitted At, Action
   - Eye icon button in Action column to expand details
   - Alternating row colors for readability
   - Pagination at bottom
   - Modern table design with hover effects

3. Expanded Row Details (when eye icon clicked):
   - Shows subject-wise breakdown
   - Section cards with question details
   - Color-coded status tags (green for correct, red for incorrect, gray for skipped)
   - Nested table showing individual questions

Style: Modern, data-heavy, organized, professional
Colors: Blue primary, green success, red error, gray neutral
Features: Expandable rows, color-coded tags, icons, modern table design
```

---

## 4. Dashboard - Student View

**Prompt:**
```
Create a personalized student dashboard showing individual performance metrics.

Layout:
- Same sidebar and header structure
- Page title: "Dashboard" with student name

Content sections:
1. Filter Section:
   - Category and Test dropdowns
   - View By: "Individual Student" selected

2. Personal Statistics (4 cards):
   - Scored Marks (blue, trophy icon) - "45 / 100"
   - Percentage (color-coded based on score, percentage icon) - "45%"
   - Correct Answers (green, checkmark icon) - "15 / 40"
   - Accuracy (color-coded, target icon) - "37.5%"
   - Large numbers, colored icon circles

3. Performance Charts (2 columns):
   - Left: Question Analysis (pie chart - Correct, Incorrect, Skipped)
   - Right: Subject-wise Performance (bar chart showing percentage per subject)

4. Time Analysis Card:
   - Total time taken
   - Average time per question
   - Visual representation

Style: Personal, encouraging, data-focused
Colors: Dynamic colors based on performance (green for good, yellow for average, red for needs improvement)
```

---

## 5. Principal Dashboard (Branch Admin View)

**Prompt:**
```
Create a principal/branch administrator dashboard for monitoring branch performance.

Layout:
- Sidebar with "Principal Dashboard" title
- Top header with branch name

Content sections:
1. Filter Section:
   - Category, Test, View By (Branch-wise, Batch-wise, Student)
   - Modern dropdowns

2. Branch Statistics (4 cards):
   - Total Submissions (green)
   - Average Score (blue)
   - Highest Score (green with up arrow)
   - Lowest Score (red with down arrow)

3. Performance Analytics:
   - Branch-wise Performance (bar chart comparing different branches)
   - Score Distribution (pie chart with 5 ranges: 0-20%, 21-40%, etc.)
   - Top Performers list (horizontal bars with student names)

4. Batch Comparison:
   - Table or chart showing batch-wise performance
   - Color-coded performance indicators

Style: Administrative, comparative, analytical
Colors: Professional blue, green, red color scheme
Focus: Comparative analytics, trends, performance monitoring
```

---

## 6. Test Management Screen (Super Admin)

**Prompt:**
```
Create a test management screen for super administrators to create and manage tests.

Layout:
- Sidebar with "Super Admin Dashboard"
- Page title: "Test Management"

Content sections:
1. Action Bar:
   - "Create Test" button (blue, with plus icon) on the right
   - Search bar on the left

2. Filter Section:
   - Search by test name
   - Category dropdown
   - Institute dropdown
   - Principal dropdown
   - Batch dropdown (multi-select)
   - "Reset Filters" button

3. Tests Table:
   - Columns: Test Name, Duration, Total Marks, Status, Start Time, Actions
   - Status shown as colored tags (green for active, gray for inactive)
   - Action buttons: Edit (pencil icon), Delete (trash icon), Duplicate (copy icon)
   - Modern table with hover effects

4. Create Test Modal (overlay):
   - Multi-step wizard with 3 steps: Basic Info, Advanced Settings, Questions
   - Progress indicator at top
   - Form fields with labels
   - Next/Previous/Submit buttons at bottom

Style: Administrative, organized, functional
Colors: Blue primary, status-based colors for tags
Features: Multi-step forms, action buttons, filters, search
```

---

## 7. Question Details Modal

**Prompt:**
```
Create a detailed question view modal showing student's answer and correct answer.

Modal design:
- Large modal (800px width)
- Title: "Question Details"
- Close button (X) in top right

Content sections:
1. Question Section:
   - Gray background box
   - Question text with mathematical notation support
   - Clear typography

2. Options Section:
   - 4 options (A, B, C, D) in separate boxes
   - Light gray background for each option
   - Option letter and text clearly visible

3. Answer Comparison (2 columns):
   - Left: Student Answer (orange/red background if wrong, green if correct)
   - Right: Correct Answer (blue background)
   - Clear labels above each

4. Solution Section:
   - Light blue background
   - "Solution:" label
   - Detailed explanation text

5. Metadata Section:
   - Status tag (Correct/Incorrect/Skipped)
   - Marks awarded
   - Time taken
   - Question type tag

Style: Educational, clear, comparison-focused
Colors: Green for correct, red for incorrect, blue for information, gray for neutral
Typography: Clear, readable, supports mathematical notation
```

---

## 8. Mobile Responsive View

**Prompt:**
```
Create mobile responsive versions of the KREIS Assessment dashboard.

Design specifications:
- Collapsible hamburger menu instead of fixed sidebar
- Stacked layout for statistics cards (1 column)
- Simplified header with menu icon and user avatar
- Touch-friendly buttons and inputs (minimum 44px height)
- Horizontal scrolling for tables
- Bottom navigation bar for main sections
- Filters in collapsible accordion
- Charts optimized for mobile width

Screens to show:
1. Mobile dashboard with hamburger menu open
2. Mobile statistics cards stacked vertically
3. Mobile table with horizontal scroll
4. Mobile filter accordion expanded

Style: Mobile-first, touch-friendly, simplified
Breakpoint: 768px and below
Features: Collapsible menus, stacked layouts, touch-optimized
```

---

## 9. Empty States

**Prompt:**
```
Create empty state screens for various scenarios in the KREIS Assessment platform.

Scenarios:
1. No Test Selected:
   - Empty state icon (clipboard or document)
   - Message: "Please select a test to view dashboard"
   - Subtle illustration
   - Light gray background

2. No Results Found:
   - Search icon or empty box illustration
   - Message: "No results found for the selected test and filters"
   - Suggestion text: "Try adjusting your filters"

3. No Submissions Yet:
   - Clock or waiting icon
   - Message: "No submissions found for the selected filters"
   - Encouraging text

4. Filters Required:
   - Filter icon
   - Message: "Please select the required filters to view dashboard"
   - List of required filters

Style: Friendly, helpful, not discouraging
Colors: Soft grays, subtle illustrations
Typography: Clear, supportive messaging
```

---

## 10. Loading States

**Prompt:**
```
Create loading state designs for the KREIS Assessment platform.

Loading scenarios:
1. Dashboard Loading:
   - Skeleton screens for statistics cards
   - Pulsing gray rectangles in card shapes
   - Skeleton for charts (circular and bar shapes)

2. Table Loading:
   - Skeleton rows with pulsing animation
   - Column structure visible
   - Loading spinner at top

3. Page Loading:
   - Centered spinner with KREIS logo
   - "Loading..." text below
   - Smooth animation

4. Button Loading:
   - Spinner inside button
   - Button disabled state
   - Text changes to "Loading..."

Style: Smooth, professional, non-intrusive
Animation: Subtle pulsing or spinning
Colors: Light gray (#f0f0f0), slightly darker gray (#e0e0e0)
```

---

## Design System Specifications

### Colors
- Primary Blue: #1890ff
- Success Green: #52c41a
- Warning Yellow: #faad14
- Error Red: #ff4d4f
- Background: #f0f2f5
- Card Background: #ffffff
- Text Primary: #262626
- Text Secondary: #8c8c8c
- Border: #f0f0f0

### Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- Heading 1: 38px, bold
- Heading 2: 30px, bold
- Heading 3: 24px, semi-bold
- Body: 14px, regular
- Small: 12px, regular

### Spacing
- Extra Small: 8px
- Small: 12px
- Medium: 16px
- Large: 24px
- Extra Large: 32px

### Border Radius
- Small: 6px
- Medium: 8px
- Large: 12px

### Shadows
- Card: 0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)
- Elevated: 0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12)

---

## Usage Instructions

1. Copy the specific prompt for the screen you want to generate
2. Use with AI image generation tools like:
   - Midjourney
   - DALL-E 3
   - Stable Diffusion
   - Figma AI plugins
   - Adobe Firefly

3. Add these suffixes for better results:
   - "UI/UX design, Figma style, clean interface"
   - "Modern web application, professional design"
   - "High fidelity mockup, detailed interface"

4. For consistency across screens:
   - Always mention "KREIS Assessment platform"
   - Reference the color scheme
   - Specify "modern, clean, professional" style
   - Include "Ant Design inspired" for component consistency

---

## Example Combined Prompt

For a complete dashboard mockup:
```
Create a complete modern dashboard screen for KREIS Assessment educational platform. 

Include: Fixed dark sidebar with KREIS logo and menu items, white header bar with "Dashboard" title and user avatar, light gray background (#f0f2f5). 

Main content: Filter section with 4 dropdowns (Institute, Category, Test, View By), 4 statistics cards in a row showing Total Submissions (green), Average Score (blue), Highest Score (green), Lowest Score (red) - each with colored icon circles and large numbers. 

Below: Two charts side by side - Score Distribution pie chart and Branch-wise Performance bar chart, both in white cards. 

Bottom: Top Performers horizontal bar chart. 

Style: Modern, clean, professional, Ant Design inspired. 
Colors: Blue #1890ff, green #52c41a, red #ff4d4f, white cards, light gray background. 
Typography: Clean sans-serif, bold headings. 
UI/UX design, high fidelity mockup, detailed interface.
```
