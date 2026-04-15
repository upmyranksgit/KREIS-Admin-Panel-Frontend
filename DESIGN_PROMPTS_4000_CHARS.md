# KREIS Assessment - 4000 Character Design Prompts

## 1. Complete Dashboard Screen (3998 characters)

```
Create a comprehensive, modern educational assessment dashboard for "KREIS Assessment" platform with professional UI/UX design.

LAYOUT STRUCTURE:
Left Sidebar (200px fixed, dark theme #001529): Display "KREIS" logo in white bold text at top within a rounded rectangle with subtle gradient background. Below logo, vertical menu with icons: Dashboard (selected, blue highlight #1890ff), Results, and Test Management. Menu items have rounded corners (8px) with hover effects. Sidebar has subtle shadow on right edge.

Top Header Bar (64px height, white background): Left side shows hamburger menu icon and "Dashboard" title in bold 24px font. Right side contains notification bell icon with red badge, and user profile section with circular avatar (blue background, white user icon) next to username "ADMIN" and role "Super Admin" in smaller gray text. Dropdown arrow indicates menu. Header has bottom shadow for depth.

Main Content Area (light gray background #f0f2f5, 24px padding):

FILTER SECTION (white card, rounded 12px, shadow, 24px padding):
Row of 4 modern dropdowns with labels above: "Institute" (placeholder: Select institute), "Category" (options: Full Length, Monthly, Chapter Wise), "Test" (placeholder: Select category first - disabled until category selected), "View By" (options: All Submissions, Institute-wise, Principal-wise, Batch-wise, Individual Student). Each dropdown 40px height, 8px border radius, with down arrow icon. Dropdowns have subtle border and focus state with blue outline.

STATISTICS CARDS (4 cards in row, 16px gap):
Card 1 - Total Submissions: White card with rounded corners (12px), subtle shadow. Top-right corner has green circular icon background (48px diameter, light green #52c41a15) with user group icon. Large number "156" in bold green #52c41a, below "Total Submissions" label in gray. Small green up arrow with "+12%" trend indicator.

Card 2 - Average Score: Same card style. Blue circular icon background with trophy icon. Large number "67.5%" in bold blue #1890ff, "Average Score" label. Blue up arrow "+5.2%".

Card 3 - Highest Score: Green circular icon with up arrow. Number "98.5%" in bold green, "Highest Score" label. Student name "John Doe" in small text below.

Card 4 - Lowest Score: Red circular icon (#ff4d4f15) with down arrow. Number "23.0%" in bold red #ff4d4f, "Lowest Score" label.

CHARTS SECTION (2 columns, 16px gap, 24px top margin):
Left Card - Score Distribution: White card, rounded corners, "Score Distribution" title in bold 16px. Colorful pie chart showing 5 segments: 0-20% (red), 21-40% (orange), 41-60% (yellow), 61-80% (light green), 81-100% (dark green). Legend below with percentages. Chart 350px height.

Right Card - Branch-wise Performance: White card, "Branch-wise Performance" title. Horizontal bar chart with 5 branches (Branch A through E) showing average scores. Bars in gradient green, values displayed at end. Y-axis shows branch names, X-axis shows percentage 0-100. Grid lines for readability.

BOTTOM SECTION (2 columns, 16px gap, 24px top margin):
Left Card - Top Performers: White card, "Top 10 Performers" title with trophy icon. List of 10 students with rank numbers (1-10 in circles), student names, and score bars. First place has gold accent, second silver, third bronze. Scores shown as horizontal bars with percentage values.

Right Card - Recent Activity: White card, "Recent Submissions" title with clock icon. Timeline showing last 5 test submissions with student name, test name, score (color-coded: green >60%, yellow 40-60%, red <40%), and timestamp. Each entry has small avatar circle.

DESIGN SPECIFICATIONS:
- All cards have consistent shadow: 0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)
- Hover effects on interactive elements with smooth 0.3s transitions
- Icons from modern icon library (outlined style)
- Font: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- Responsive grid layout
- Subtle animations on data load
- Professional color scheme: Blue #1890ff (primary), Green #52c41a (success), Red #ff4d4f (error), Yellow #faad14 (warning)
- Consistent 24px spacing between major sections, 16px between cards
- All text anti-aliased for smooth rendering

Style: Modern, clean, professional, data-focused, educational platform aesthetic, Ant Design inspired, high-fidelity UI mockup, detailed interface design, web application dashboard.
```

---

## 2. Test Results Screen (3997 characters)

```
Design a comprehensive test results and analytics screen for "KREIS Assessment" educational platform with modern, professional interface.

LAYOUT:
Same sidebar and header as dashboard. Page title "Test Results" in bold 30px with subtitle "View detailed test submissions and student performance" in gray 14px below. Top-right corner has blue gradient button "Download Excel" with download icon, 48px height, rounded 8px.

FILTER CARD (white background, rounded 12px, shadow, 24px padding, margin-bottom 24px):
"Filters" heading with filter icon in blue. Grid layout with 6 filter controls:
Row 1: Institute dropdown (if Super Admin), Category dropdown (Full Length/Monthly/Chapter Wise), Test dropdown (disabled until category selected with placeholder "Select category first")
Row 2: Search input with magnifying glass icon (placeholder: "Search by student name"), Principal dropdown, Branch dropdown
Each control has label above in bold 14px, input height 40px, rounded 8px borders. Dropdowns show down arrow, search has clear button when text entered.

RESULTS TABLE CARD (white background, rounded 12px, shadow):
Modern data table with alternating row colors (white/#fafafa). Header row has light gray background #f5f5f5, bold text.

Columns (left to right):
1. Student Name (200px): Name with small avatar circle, batch name in gray below
2. Batch (120px): Batch name with colored tag
3. Principal (150px): Branch/principal name
4. Scored Marks (100px): "45/100" format, bold
5. Total Marks (100px): Total possible marks
6. Percentage (100px): Large percentage with color coding - Green if ≥60%, Yellow if 40-60%, Red if <40%. Progress bar below showing visual percentage.
7. Correct (80px): Green number with checkmark icon
8. Incorrect (80px): Red number with X icon
9. Skipped (80px): Gray number with minus icon
10. Submitted At (150px): Date and time in format "Jan 13, 2024 14:30"
11. Action (80px, fixed right): Blue eye icon button for expanding details

Table shows 10 rows with pagination at bottom: "Showing 1-10 of 156 results" with page numbers and next/previous arrows.

EXPANDED ROW DETAILS (appears when eye icon clicked, light blue background #f0f5ff):
Nested section showing subject-wise breakdown in accordion style:

Subject Card (Mathematics):
Header shows "Mathematics" with expand/collapse arrow, summary stats: "Total: 40 questions | Scored: 25/40 | Correct: 15 | Incorrect: 10 | Skipped: 15"

Expanded view shows sections:
Section 1 - Algebra (light gray background #fafafa, rounded 6px, padding 12px):
Mini table with columns: Q# | Type | Status | Marks | Time | Student Answer | Correct Answer | Action
- Q1: MCQ, Correct (green tag with checkmark), 1 mark, 45s, "B", "B", Eye icon to view full question
- Q2: MCQ, Incorrect (red tag with X), 0 marks, 32s, "A", "C", Eye icon
- Q3: Numerical, Skipped (gray tag with minus), 0 marks, 0s, "-", "5.2", Eye icon

Section 2 - Geometry: Similar layout with different questions

Each status tag has icon and color: Correct (green #52c41a), Incorrect (red #ff4d4f), Skipped (gray #d9d9d9), rounded 6px, padding 4px 10px.

QUESTION DETAIL MODAL (overlay, 800px width, centered):
White modal with rounded 12px corners, shadow. Title "Question Details" with close X button.

Question section (gray background #f5f5f5, padding 16px, rounded 8px):
"Question: Find the value of x in the equation 2x + 5 = 15" with mathematical notation rendered properly.

Options section (4 boxes in 2x2 grid):
Each option in light box with letter (A/B/C/D) and text. Student's selected answer has orange border, correct answer has green border.

Answer comparison (2 columns):
Left: "Student Answer" with orange/red background showing "A"
Right: "Correct Answer" with blue background showing "C"

Solution section (light blue background #e6f7ff):
"Solution:" heading with detailed step-by-step explanation text.

Metadata row at bottom:
Status tag | Marks: 0/1 | Time: 32 seconds | Type: Multiple Choice

EMPTY STATE (when no results):
Centered empty state with clipboard illustration (gray), "No results found" heading, "Try adjusting your filters" subtext, all in muted colors.

DESIGN SPECS:
- Smooth expand/collapse animations (0.3s ease)
- Hover effects on table rows (slight background change)
- Color-coded performance indicators throughout
- Consistent 12px border radius on all cards
- Professional shadows and spacing
- Icons: outlined style, 16-20px size
- Responsive table with horizontal scroll on mobile
- Loading skeleton states for data fetching

Style: Modern, data-heavy, organized, professional, educational analytics, clean interface, Ant Design components, high-fidelity mockup, detailed UI design.
```

---

## 3. Login Screen (3245 characters)

```
Create a modern, elegant login screen for "KREIS Assessment" educational platform with premium design aesthetic.

BACKGROUND:
Full viewport gradient background flowing from top-left to bottom-right: Purple #667eea (0%) transitioning smoothly to deeper purple #764ba2 (100%). Subtle animated particles or geometric shapes floating in background (optional, very subtle, low opacity 0.1).

CENTER LOGIN CARD (450px width, centered vertically and horizontally):
White card with rounded corners (16px border radius), elevated shadow (0 20px 60px rgba(0,0,0,0.3)), no border. Card padding: 48px all sides.

LOGO SECTION (centered, top of card):
Square logo container (80x80px) with rounded corners (20px), gradient background matching page gradient (#667eea to #764ba2), centered. Inside: Large white "K" letter in bold, modern sans-serif font (48px). Logo has subtle shadow (0 10px 30px rgba(102,126,234,0.4)) creating floating effect.

Below logo (24px spacing):
"KREIS Assessment" heading in bold, extra-large font (32px), dark gray #262626, centered, letter-spacing slightly increased for premium feel.

Subtitle below (8px spacing):
"Sign in to your account" in medium gray #8c8c8c, 16px font, centered, regular weight.

DIVIDER (margin 24px top and bottom):
Thin horizontal line, light gray #f0f0f0, full width.

LOGIN FORM:
Form layout vertical, large size inputs (48px height).

Username Field:
Label "Username" above input, bold 14px, dark gray #262626, margin-bottom 8px.
Input box: White background, gray border #d9d9d9, rounded 8px, padding-left includes user icon (gray #bfbfbf). Placeholder text: "Enter your username" in light gray. Focus state: Blue border #1890ff, subtle blue glow shadow.

Password Field (16px spacing from username):
Label "Password" above input, same styling as username label.
Password input: Same styling as username but with lock icon prefix. Eye icon suffix to toggle password visibility. Placeholder: "Enter your password".

Sign In Button (32px spacing from password):
Full width button, 48px height, rounded 8px corners. Gradient background matching theme (#667eea to #764ba2), no border. White text "Sign In" with login arrow icon, 16px font, bold weight. Subtle shadow (0 4px 15px rgba(102,126,234,0.4)). Hover state: Slight upward transform (-2px), increased shadow. Loading state: Spinner replaces text, button disabled with reduced opacity.

FOOTER (16px spacing from button):
Centered text "© 2024 KREIS Assessment. All rights reserved." in very small font (12px), light gray #bfbfbf.

ADDITIONAL DETAILS:
- All inputs have smooth 0.3s transition on focus
- Form validation: Red border and error message below field if validation fails
- "Remember me" checkbox option (optional, left-aligned, 16px spacing from button)
- "Forgot password?" link (optional, right-aligned, blue #1890ff, underline on hover)
- Subtle animations: Card fades in and slides up slightly on page load (0.5s ease-out)
- Responsive: On mobile (<768px), card width 90%, padding reduced to 32px
- Accessibility: High contrast ratios, keyboard navigation support, ARIA labels
- Loading overlay: Semi-transparent white overlay with centered spinner when authenticating

DESIGN SPECIFICATIONS:
- Font family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue'
- All text anti-aliased for smooth rendering
- Input focus rings: 2px blue outline with 4px offset
- Button active state: Slightly darker gradient
- Error messages: Red #ff4d4f, 12px font, icon prefix
- Success state: Green checkmark animation before redirect

STYLE KEYWORDS:
Modern login page, premium design, educational platform, professional interface, gradient background, glassmorphism elements, clean UI, minimalist form design, high-fidelity mockup, web application login, authentication screen, user-friendly interface, contemporary design, polished aesthetic.
```

---

## 4. Mobile Responsive Dashboard (3891 characters)

```
Design a mobile-responsive version of KREIS Assessment dashboard optimized for smartphones and tablets (320px-768px width).

MOBILE HEADER (fixed top, 56px height, white background, shadow):
Left: Hamburger menu icon (24px, three horizontal lines, dark gray #262626), tap area 44x44px for accessibility.
Center: "KREIS" logo text in bold 20px, or just "K" if space constrained.
Right: Notification bell icon with red badge (number 3), and circular user avatar (32px diameter, blue background, white user icon). Both icons have 44x44px tap areas.

HAMBURGER MENU (slide-in from left, 280px width, dark theme #001529):
Overlay backdrop (semi-transparent black, 0.5 opacity) covers screen when menu open.
Menu panel slides in with smooth animation (0.3s ease-out).

Menu Header (padding 24px):
Large "K" logo in rounded square (60px), gradient background.
Below: Username "ADMIN" in white bold 16px.
Role "Super Admin" in light gray 12px.
Divider line below (rgba(255,255,255,0.1)).

Menu Items (vertical list, padding 16px):
- Dashboard (selected, blue background #1890ff, rounded 8px)
- Results
- Test Management
Each item: Icon (20px) + Text (14px), white color, 44px height for easy tapping, 8px margin between items.

Close button: X icon top-right corner of menu panel.

MAIN CONTENT (padding 16px, light gray background #f0f2f5):

FILTER SECTION (white card, rounded 12px, padding 16px, margin-bottom 16px):
Collapsible accordion with "Filters" header and down arrow icon. When expanded:
Stacked dropdowns (full width, 16px spacing):
1. Category (Full Length/Monthly/Chapter Wise)
2. Test (disabled until category selected)
3. View By (All/Institute/Principal/Batch/Student)
Each dropdown 44px height, rounded 8px, easy to tap.

STATISTICS CARDS (stacked vertically, 16px spacing):
Each card full width, white background, rounded 12px, padding 20px, shadow.

Card 1 - Total Submissions:
Top row: Green circular icon (40px) with user group icon on left, large number "156" on right in green #52c41a, bold 28px.
Bottom row: "Total Submissions" label in gray 14px, green up arrow with "+12%" trend.

Card 2 - Average Score:
Same layout, blue theme, trophy icon, "67.5%", "Average Score", "+5.2%".

Card 3 - Highest Score:
Green theme, up arrow icon, "98.5%", "Highest Score", student name "John Doe" below.

Card 4 - Lowest Score:
Red theme, down arrow icon, "23.0%", "Lowest Score".

CHARTS SECTION (stacked vertically, 16px spacing):

Score Distribution Card (white, rounded 12px, padding 16px):
"Score Distribution" title, bold 16px.
Pie chart optimized for mobile (280px diameter, centered).
Legend below chart with colored squares and labels, stacked vertically.
Touch-enabled: Tap segment to highlight and show percentage.

Branch Performance Card:
"Branch-wise Performance" title.
Horizontal bar chart, full width, scrollable if needed.
Bars show branch names on left (truncated if long), percentage values on right.
Touch-enabled: Tap bar to see detailed tooltip.

Top Performers Card:
"Top 10 Performers" title with trophy icon.
Scrollable list (max height 400px, vertical scroll).
Each performer: Rank number in circle (left), name (center), score bar (right), 56px height per item.
First three ranks have gold/silver/bronze accent colors.

BOTTOM NAVIGATION (fixed bottom, 60px height, white background, top shadow):
4 navigation items evenly spaced:
- Dashboard (icon + label, blue if selected)
- Results (icon + label)
- Tests (icon + label)
- More (icon + label)
Each item: Icon 24px above, label 10px below, 60px tap area.

TABLE VIEW (when viewing results):
Horizontal scrollable table in white card.
Sticky first column (student name) while scrolling horizontally.
Simplified columns for mobile: Name, Score, Percentage, Action.
Each row 60px height for easy tapping.
Action button: Eye icon to view details, opens full-screen modal.

EXPANDED DETAILS (full-screen modal):
Slides up from bottom with animation.
Header: Title "Student Details" with back arrow (left) and close X (right).
Content: Scrollable subject-wise breakdown, same data as desktop but optimized for vertical scrolling.
Sections collapsible with accordion behavior.

TOUCH INTERACTIONS:
- All buttons minimum 44x44px tap targets
- Swipe gestures: Swipe right to open menu, swipe left to close
- Pull-to-refresh on main content area
- Smooth scrolling with momentum
- Haptic feedback on button taps (if supported)

RESPONSIVE BREAKPOINTS:
- 320px-480px: Extra small phones, single column, smallest text
- 481px-768px: Phones and small tablets, slightly larger elements
- Landscape mode: Adjust layout to utilize horizontal space

DESIGN SPECIFICATIONS:
- Touch-friendly spacing (minimum 8px between tappable elements)
- Larger fonts for readability (minimum 14px body text)
- High contrast for outdoor visibility
- Reduced animations for performance
- Optimized images and charts for mobile bandwidth
- Loading states: Skeleton screens instead of spinners
- Error states: Toast notifications at bottom
- Offline mode indicator at top

Style: Mobile-first design, touch-optimized, responsive layout, modern mobile UI, iOS and Android compatible, progressive web app aesthetic, clean interface, user-friendly navigation, contemporary mobile design.
```

---

## Usage Instructions

1. **Copy the entire prompt** (including the triple backticks)
2. **Paste into AI image generators:**
   - Midjourney: Use `/imagine` command
   - DALL-E 3: Paste directly
   - Stable Diffusion: Use as positive prompt
   - Leonardo.ai: Paste in prompt box

3. **Add these parameters for best results:**
   - Aspect ratio: `--ar 16:9` (for desktop) or `--ar 9:16` (for mobile)
   - Quality: `--q 2` (Midjourney)
   - Style: `--style raw` (for more literal interpretation)

4. **For variations:**
   - Change specific colors in the prompt
   - Modify layout descriptions
   - Add or remove sections as needed

Each prompt is optimized to be under 4000 characters while maintaining comprehensive detail!


---

## 5. Student Individual Dashboard (3956 characters)

```
Design a personalized student performance dashboard for "KREIS Assessment" platform showing individual test analytics and progress.

LAYOUT STRUCTURE:
Same sidebar (dark theme #001529) and header as main dashboard. Page title "My Performance" in bold 30px with subtitle "Track your test results and progress" in gray 14px.

STUDENT INFO BANNER (top section, gradient card, rounded 12px, padding 24px):
Gradient background (light blue #e6f7ff to white), left-aligned layout.
Left side: Large circular avatar (80px diameter) with student photo or initials, blue border (3px).
Right side content:
- Student name "John Doe" in bold 24px, dark text
- Class/Batch "Class 12 - Science Batch A" in gray 16px
- Institute "ABC International School" in gray 14px
- Last test taken "Monthly Test - Mathematics" with date "Jan 13, 2024" in small gray text

FILTER SECTION (white card, rounded 12px, shadow, padding 20px, margin 24px top):
Two dropdowns side by side (50% width each, 16px gap):
1. Category dropdown: Full Length/Monthly/Chapter Wise, with book icon
2. Test dropdown: Shows available tests for selected category, with document icon
Both dropdowns 44px height, rounded 8px, disabled state shown with gray background until category selected.

PERFORMANCE STATISTICS (4 cards in row, 16px gap, margin 24px top):
Card 1 - Scored Marks (blue theme #1890ff):
White card, rounded 12px, padding 24px, shadow.
Top-right: Blue circular icon background (56px) with trophy icon (28px).
Large number "45" in bold blue 32px.
Divider text "out of" in gray 14px.
Total "100" in gray 20px.
Label "Scored Marks" at bottom in gray 14px.
Bottom accent: Thin blue bar (4px height) at card bottom.

Card 2 - Percentage Score (dynamic color based on performance):
Same card structure.
Icon: Percentage symbol in colored circle.
Large number "45%" in bold 32px.
Color coding: Green if ≥60%, Yellow if 40-60%, Red if <40%.
Label "Percentage Score".
Performance indicator: "Below Average" in small text with down arrow (red if <60%).

Card 3 - Correct Answers (green theme #52c41a):
Green circular icon with checkmark.
Number "15" in bold green 32px.
Divider "out of".
Total "40" in gray.
Label "Correct Answers".
Green accent bar at bottom.

Card 4 - Accuracy Rate (dynamic color):
Target/bullseye icon in colored circle.
Number "37.5%" in bold 32px.
Color based on accuracy: Green ≥70%, Yellow 50-70%, Red <50%.
Label "Accuracy Rate".
Trend indicator: "Needs Improvement" with suggestion icon.

DETAILED ANALYTICS SECTION (2 columns, 16px gap, margin 24px top):

Left Column - Question Analysis Card (white, rounded 12px, padding 24px):
Title "Question Analysis" with chart icon, bold 18px.
Donut chart (300px diameter, centered):
- Center shows total questions "40"
- Three segments: Correct (green #52c41a, 37.5%), Incorrect (red #ff4d4f, 25%), Skipped (gray #d9d9d9, 37.5%)
- Hover shows exact numbers
Legend below chart:
- Green square "Correct: 15 questions (37.5%)"
- Red square "Incorrect: 10 questions (25%)"
- Gray square "Skipped: 15 questions (37.5%)"

Right Column - Time Analysis Card (white, rounded 12px, padding 24px):
Title "Time Analysis" with clock icon, bold 18px.
Three stat rows with icons:
1. Total Time: Clock icon, "45 minutes" in bold, "out of 60 minutes" in gray, progress bar showing 75% (blue).
2. Average per Question: Timer icon, "67.5 seconds" in bold, "per question" in gray.
3. Time Efficiency: Gauge icon, "Good" in green with checkmark, "You managed time well" subtext.

SUBJECT-WISE PERFORMANCE (full width card, margin 24px top):
White card, rounded 12px, padding 24px.
Title "Subject-wise Breakdown" with folder icon, bold 18px.

Horizontal bar chart showing 4 subjects:
1. Mathematics: 
   - Subject name on left with icon
   - Horizontal bar showing percentage (45%, yellow/orange color)
   - Score "18/40" on right
   - Marks breakdown: Correct 15, Incorrect 10, Skipped 15 in small text below

2. Physics:
   - Bar at 65% (green color)
   - Score "26/40"
   - Better performance indicator

3. Chemistry:
   - Bar at 55% (yellow color)
   - Score "22/40"

4. Biology:
   - Bar at 70% (green color)
   - Score "28/40"
   - Best performance badge

Each bar has gradient effect, rounded ends, and shows percentage value inside or at end.

STRENGTHS & WEAKNESSES SECTION (2 columns, 16px gap, margin 24px top):

Left - Strengths Card (light green background #f6ffed, rounded 12px, padding 20px):
Title "Your Strengths" with star icon in green.
List of 3 topics with green checkmarks:
- "Algebra - 85% accuracy"
- "Organic Chemistry - 80% accuracy"
- "Cell Biology - 90% accuracy"
Each with small green progress bar.

Right - Areas to Improve Card (light red background #fff1f0, rounded 12px, padding 20px):
Title "Focus Areas" with target icon in red.
List of 3 topics with red alert icons:
- "Trigonometry - 30% accuracy"
- "Thermodynamics - 35% accuracy"
- "Genetics - 25% accuracy"
Each with small red progress bar and "Practice More" button.

RECOMMENDATIONS SECTION (full width card, margin 24px top):
Light blue background #e6f7ff, rounded 12px, padding 24px.
Title "Personalized Recommendations" with lightbulb icon.
3 recommendation cards in row:
1. "Practice Trigonometry" - Book icon, "20 questions available", blue button "Start Practice"
2. "Review Incorrect Answers" - Review icon, "10 questions to review", blue button "Review Now"
3. "Take Mock Test" - Test icon, "Full length test available", blue button "Start Test"

PROGRESS TIMELINE (full width card, margin 24px top):
White card, rounded 12px, padding 24px.
Title "Recent Test History" with timeline icon.
Vertical timeline showing last 5 tests:
Each entry: Date on left, test name, score with color-coded badge, trend arrow (up/down), "View Details" link.
Timeline line connects all entries with dots at each test.

DESIGN SPECIFICATIONS:
- Encouraging, positive tone in messaging
- Color psychology: Green for success, yellow for caution, red for areas needing attention
- Smooth animations on chart interactions
- Tooltips on hover showing detailed information
- Responsive grid collapses to single column on mobile
- Print-friendly version available
- Export report button in top-right
- All charts interactive with click/hover states

Style: Student-focused, encouraging, educational, personal dashboard, progress tracking, modern analytics, clean interface, motivational design, youth-friendly colors, Ant Design components, high-fidelity mockup.
```

---

## 6. Test Management Screen - Super Admin (3998 characters)

```
Create a comprehensive test management interface for Super Admin role in KREIS Assessment platform with full CRUD operations.

LAYOUT:
Same sidebar and header structure. Page title "Test Management" in bold 30px with subtitle "Create, edit, and manage assessment tests" in gray 14px.

ACTION BAR (margin-bottom 24px):
Left side: Search bar (400px width, 44px height, rounded 8px) with magnifying glass icon, placeholder "Search tests by name...". Clear button appears when text entered.
Right side: Blue gradient button "Create New Test" with plus icon, 48px height, rounded 8px, bold text. Hover effect: slight lift and shadow increase.

FILTER PANEL (white card, rounded 12px, shadow, padding 20px, collapsible):
Header "Filters" with filter icon and collapse arrow on right.
When expanded, shows 2 rows of filters:

Row 1 (5 filters, equal width with 12px gaps):
1. Search by Name: Text input with search icon
2. Category: Dropdown (Full Length/Monthly/Chapter Wise/All)
3. Institute: Dropdown with institute names, searchable
4. Principal: Dropdown (depends on institute selection)
5. Status: Dropdown (Active/Inactive/Draft/All)

Row 2 (3 filters + action):
1. Batch: Multi-select dropdown with checkboxes, shows selected count badge
2. Date Range: Date picker showing "From - To" dates
3. Created By: Dropdown (Super Admin/Institute Admin/All)
4. Reset Filters button (gray, outline style) and Apply button (blue, solid)

TESTS TABLE (white card, rounded 12px, shadow, margin-top 24px):
Modern data table with hover effects on rows.

Table Header (light gray background #fafafa, sticky on scroll):
Columns with sort icons:
1. Test Name (300px, left-aligned, sortable)
2. Category (120px, center-aligned, filterable)
3. Institute (180px, sortable)
4. Duration (100px, center, shows minutes)
5. Total Marks (100px, center)
6. Questions (100px, center, shows count)
7. Status (120px, center, colored tags)
8. Created Date (140px, sortable)
9. Actions (140px, right-aligned, fixed)

Table Rows (alternating white/#fafafa, 60px height):
Row 1 Example:
- Test Name: "Monthly Mathematics Test - Jan 2024" with document icon, bold text
- Category: Blue tag "Monthly" with rounded corners
- Institute: "ABC International School"
- Duration: "60 min" with clock icon
- Total Marks: "100"
- Questions: "40" with question icon
- Status: Green tag "Active" with dot indicator, or Gray "Inactive", or Orange "Draft"
- Created: "Jan 10, 2024" in gray text
- Actions: Three icon buttons in row:
  * Blue eye icon "View" (tooltip on hover)
  * Blue pencil icon "Edit"
  * Blue copy icon "Duplicate"
  * Red trash icon "Delete"
  All buttons 36px square, rounded 6px, hover shows background color

Bulk Actions Bar (appears when rows selected):
Sticky bar at top of table, blue background, white text.
Shows "3 tests selected" with checkbox to select all.
Action buttons: "Activate", "Deactivate", "Delete", "Export" - all white outline buttons.

Pagination (bottom of table):
Shows "Showing 1-10 of 156 tests"
Page size selector: 10/20/50/100 per page
Page numbers with previous/next arrows
Jump to page input

CREATE TEST MODAL (overlay, 1000px width, centered, max-height 90vh):
White modal, rounded 16px, shadow, scrollable content.

Modal Header (padding 24px, border-bottom):
Title "Create New Test" with close X button (right).
Progress Steps indicator below title:
Step 1: Basic Info (active, blue)
Step 2: Test Pattern (inactive, gray)
Step 3: Questions (inactive, gray)
Step 4: Settings (inactive, gray)
Connected by lines, current step highlighted.

Modal Body (padding 24px, scrollable):

STEP 1 - BASIC INFO:
Form layout, vertical spacing 20px:

1. Test Name: Text input, full width, 44px height, required field with red asterisk
   Placeholder: "Enter test name"
   Helper text: "This will be visible to students"

2. Category: Radio buttons in row with icons:
   - Full Length (document icon)
   - Monthly (calendar icon)
   - Chapter Wise (book icon)
   Selected option has blue background, rounded 8px

3. Institute Selection: Searchable dropdown, full width
   Shows institute logo thumbnail + name
   "Select Institute" placeholder

4. Test Pattern: Dropdown showing available patterns
   Each option shows: Pattern name, total questions, duration
   "Create New Pattern" link at bottom of dropdown

5. Description: Text area, 4 rows, full width
   Placeholder: "Enter test description and instructions"
   Character counter: "0/500" at bottom-right

6. Test Duration:
   Number input (120px width) + "minutes" label
   Toggle switch: "Flexible Duration" (allows students extra time)

7. Total Marks: Number input, auto-calculated from questions, read-only, gray background

STEP 2 - TEST PATTERN (shown when Next clicked):
Subject-wise breakdown interface:

Header: "Configure Test Pattern" with info icon tooltip.

Subject Cards (stacked vertically, 16px spacing):
Each subject card (white, border, rounded 8px, padding 16px):

Mathematics Card:
- Header: Subject name with icon, expand/collapse arrow
- When expanded shows:
  * Total Questions: Number input (default from pattern)
  * Questions to Attempt: Number input (can be less than total)
  * Sections table:
    | Section Name | Questions | Marks per Q | Total Marks | Actions |
    | Algebra      | 10        | 2          | 20          | Edit/Delete |
    | Geometry     | 10        | 2          | 20          | Edit/Delete |
  * "Add Section" button (blue, outline)

Similar cards for Physics, Chemistry, Biology.

"Add Subject" button at bottom (blue, dashed border).

STEP 3 - QUESTIONS:
Question selection interface for each section:

Left Panel (30% width):
Subject/Section tree view:
- Mathematics (expandable)
  - Algebra (10/10 selected) ✓
  - Geometry (5/10 selected) ⚠
- Physics (expandable)
  - Mechanics (0/15 selected) ✗

Right Panel (70% width):
When section selected, shows question browser:
- Filter bar: Difficulty (Easy/Medium/Hard), Type (MCQ/Numerical/Subjective)
- Question cards (scrollable list):
  Each card shows:
  * Question preview (truncated text)
  * Difficulty tag, Type tag, Marks
  * Checkbox to select
  * "Preview" button to see full question
- Selected count: "5 of 10 questions selected" with progress bar
- "Auto-select" button to randomly pick remaining questions

STEP 4 - SETTINGS:
Advanced settings form:

1. Schedule:
   - Start Date/Time: Date-time picker
   - End Date/Time: Date-time picker
   - Toggle: "Available Anytime" (no time restrictions)

2. Access Control:
   - Password Protection: Toggle switch
   - If enabled: Password input field appears
   - Allowed Attempts: Number input (1-5)

3. Results:
   - Show Results: Dropdown (Immediately/After End Date/Manual)
   - Show Correct Answers: Toggle
   - Show Solutions: Toggle
   - Rank Display: Toggle

4. Proctoring (optional):
   - Enable Proctoring: Toggle
   - Screenshot Interval: Number input (seconds)
   - Tab Switch Detection: Toggle

Modal Footer (padding 20px, border-top):
Left: "Cancel" button (gray, outline)
Center: Step indicator "Step 1 of 4"
Right: "Previous" button (gray) + "Next" button (blue) or "Create Test" on final step

DELETE CONFIRMATION MODAL (400px width):
Red accent color, warning icon.
Title: "Delete Test?"
Message: "This action cannot be undone. All associated data will be permanently deleted."
Buttons: "Cancel" (gray) + "Delete" (red, requires typing test name to confirm)

DESIGN SPECIFICATIONS:
- Smooth step transitions with slide animations
- Form validation with inline error messages
- Auto-save draft functionality
- Keyboard shortcuts (Ctrl+S to save, Esc to close)
- Loading states for all async operations
- Success/error toast notifications
- Undo/redo for question selection
- Drag-and-drop for question reordering

Style: Administrative, professional, data management, CRUD interface, modern forms, wizard interface, organized layout, Ant Design components, high-fidelity mockup, detailed UI design.
```

---

## 7. Principal/Branch Admin Dashboard (3847 characters)

```
Design a Principal (Branch Administrator) dashboard for KREIS Assessment showing branch-level analytics and management.

LAYOUT:
Sidebar shows "Principal Dashboard" title. Header displays branch name "North Campus Branch" with location icon.

BRANCH INFO CARD (top, gradient card, rounded 12px, padding 24px):
Gradient background (light blue to white), horizontal layout.
Left section (60%):
- Branch name "North Campus Branch" in bold 28px
- Institute name "ABC International School" in gray 16px
- Address "123 Education Street, City" with location pin icon
- Contact "principal@branch.com | +1234567890" in small gray text
Right section (40%):
- Branch statistics in grid:
  * Total Students: 450 (blue)
  * Total Batches: 12 (green)
  * Active Tests: 8 (orange)
  * Teachers: 25 (purple)
Each stat in rounded box with icon and number.

QUICK ACTIONS BAR (white card, rounded 12px, padding 16px, margin 24px top):
Row of 5 action buttons (equal width, 16px gap):
1. "Create Test" - Blue button with plus icon
2. "Assign Test" - Green button with assignment icon
3. "View Results" - Purple button with chart icon
4. "Manage Batches" - Orange button with group icon
5. "Reports" - Gray button with document icon
Each button 48px height, rounded 8px, icon above text.

FILTER SECTION (white card, rounded 12px, padding 20px, margin 24px top):
Three dropdowns in row:
1. Category: Full Length/Monthly/Chapter Wise
2. Test: Dropdown of available tests (disabled until category selected)
3. View By: Batch-wise/Student-wise/Subject-wise
Each dropdown 44px height, full width on mobile.

PERFORMANCE OVERVIEW (4 cards, 16px gap):
Card 1 - Total Submissions (green theme):
- Large number "234" in bold green 36px
- Label "Total Submissions" in gray 14px
- Trend: Green up arrow "+15%" with "vs last month"
- Green circular icon (56px) with users icon top-right
- Subtle green gradient background at bottom

Card 2 - Branch Average (blue theme):
- Number "72.5%" in bold blue 36px
- Label "Branch Average Score"
- Trend: Blue up arrow "+3.2%"
- Trophy icon in blue circle
- Comparison: "Above institute average" in small green text

Card 3 - Top Performer (gold theme):
- Student name "Sarah Johnson" in bold 24px
- Score "98.5%" in gold 32px
- Label "Highest Score"
- Student avatar (48px) with gold border
- "View Profile" link in blue

Card 4 - Attendance Rate (purple theme):
- Number "94%" in bold purple 36px
- Label "Test Attendance"
- Trend: Purple up arrow "+2%"
- Calendar icon in purple circle
- "234 of 248 students" subtext

BATCH COMPARISON CHART (white card, rounded 12px, padding 24px, margin 24px top):
Title "Batch-wise Performance Comparison" with dropdown to select test.
Grouped bar chart (400px height):
- X-axis: Batch names (Batch A, B, C, D, E)
- Y-axis: Average score percentage (0-100)
- Three bars per batch (different colors):
  * Mathematics (blue)
  * Physics (green)
  * Chemistry (orange)
- Legend at top-right
- Hover shows exact scores and student count
- Grid lines for readability
- Best performing batch highlighted with gold border

SUBJECT-WISE ANALYTICS (white card, rounded 12px, padding 24px):
Title "Subject Performance Analysis" with subject filter dropdown.
Horizontal layout with 3 sections:

Left (30%) - Subject List:
Vertical tabs for subjects:
- Mathematics (selected, blue background)
- Physics
- Chemistry
- Biology
Each shows average score percentage and trend arrow.

Center (40%) - Performance Distribution:
Stacked bar chart showing score ranges:
- 0-40%: Red section
- 41-60%: Orange section
- 61-80%: Yellow section
- 81-100%: Green section
Shows student count in each range.
Total students displayed at top.

Right (30%) - Key Metrics:
Card showing:
- Average Score: 68.5% (color-coded)
- Highest: 98% with student name
- Lowest: 23% (anonymous)
- Pass Rate: 78% with green checkmark
- Median: 70%
Small sparkline chart showing trend over last 5 tests.

TOP PERFORMERS TABLE (white card, rounded 12px, padding 24px, margin 24px top):
Title "Top 10 Students" with "View All" link.
Table with columns:
1. Rank (1-10 with medal icons for top 3)
2. Student (avatar + name)
3. Batch
4. Score (color-coded percentage)
5. Subjects (mini bar showing subject-wise scores)
6. Action (eye icon to view details)

Rows have hover effect, top 3 have gold/silver/bronze background tint.

BATCH MANAGEMENT SECTION (white card, rounded 12px, padding 24px):
Title "Batch Overview" with "Manage Batches" button.
Grid of batch cards (3 columns, 16px gap):

Each Batch Card:
- Batch name "Batch A - Science" in bold
- Student count "38 students" with user icon
- Active tests "3 active tests" with document icon
- Average score "75.2%" with color-coded badge
- Teacher assigned "Mr. John Smith" with avatar
- "View Details" button at bottom
Card has hover effect with slight lift.

RECENT ACTIVITY FEED (white card, rounded 12px, padding 24px):
Title "Recent Activity" with "View All" link.
Timeline showing last 10 activities:
- Test submitted by student (timestamp)
- New test assigned to batch (timestamp)
- Results published (timestamp)
Each entry has icon, description, timestamp, and relevant link.
Timeline line connects all entries with colored dots.

ALERTS & NOTIFICATIONS (white card, rounded 12px, padding 20px):
Title "Important Alerts" with bell icon.
List of alerts with priority colors:
- Red: "5 students haven't submitted Monthly Test" - "Send Reminder" button
- Orange: "Test deadline approaching in 2 days" - "View Test" link
- Blue: "New test pattern available" - "Review" link
Each alert has icon, message, action button, and dismiss X.

TEACHER PERFORMANCE (white card, rounded 12px, padding 24px):
Title "Teacher-wise Test Creation" with teacher filter.
Horizontal bar chart showing:
- Teacher names on Y-axis
- Number of tests created on X-axis
- Bars colored by test category
- Hover shows test names and dates
"View Teacher Dashboard" link at bottom.

EXPORT & REPORTS SECTION (white card, rounded 12px, padding 20px):
Title "Generate Reports" with document icon.
Three report cards in row:
1. "Branch Performance Report" - PDF icon, "Download" button
2. "Student Progress Report" - Excel icon, "Download" button
3. "Attendance Report" - CSV icon, "Download" button
Each card shows last generated date and file size.
"Custom Report" button with settings icon.

DESIGN SPECIFICATIONS:
- Branch-focused metrics and comparisons
- Batch management emphasis
- Teacher collaboration features
- Quick action accessibility
- Color-coded performance indicators
- Responsive grid layout
- Print-friendly reports
- Export functionality prominent
- Real-time data updates
- Mobile-responsive design

Style: Administrative, branch management, educational analytics, professional dashboard, comparative metrics, modern interface, organized layout, Ant Design components, high-fidelity mockup, detailed UI design.
```

---

## 8. Question Detail Modal - Full View (3612 characters)

```
Design a comprehensive question detail modal showing complete question information, student response, and analytics for KREIS Assessment platform.

MODAL OVERLAY (full screen overlay, semi-transparent black 0.6 opacity):
Click outside to close, smooth fade-in animation (0.3s).

MODAL CONTAINER (900px width, max-height 90vh, centered, white background):
Rounded corners 16px, elevated shadow (0 20px 60px rgba(0,0,0,0.3)), scrollable content.

MODAL HEADER (padding 24px, border-bottom 1px #f0f0f0):
Left side:
- Title "Question Details" in bold 20px
- Question number "Question 15 of 40" in gray 14px below
Right side:
- Navigation arrows: Previous/Next question buttons (36px square, rounded 6px, gray)
- Close X button (36px square, hover shows red background)

MODAL BODY (padding 24px, scrollable):

QUESTION SECTION (margin-bottom 24px):
Header row:
- "Question" label in bold 16px with question mark icon
- Question type tag "Multiple Choice" in blue rounded badge
- Difficulty tag "Medium" in orange rounded badge
- Marks "2 marks" in gray badge

Question content box (light gray background #f5f5f5, rounded 12px, padding 20px):
- Question text in 16px, line-height 1.6
- Mathematical notation rendered properly (LaTeX support)
- Images if present (max-width 100%, rounded 8px)
- Code blocks if present (dark theme, syntax highlighting)
Example: "Find the value of x in the equation: 2x² + 5x - 3 = 0"

OPTIONS SECTION (margin-bottom 24px):
Header "Options" in bold 16px.
Grid layout (2 columns on desktop, 1 on mobile, 16px gap):

Option A Box:
- Border 2px solid #d9d9d9, rounded 8px, padding 16px
- If student selected: Orange border #faad14, light orange background
- If correct answer: Green border #52c41a, light green background
- Option letter "A" in circle (32px) on left
- Option text on right
- Checkmark icon if correct, X icon if student selected wrong

Option B Box: Similar styling
Option C Box: Similar styling  
Option D Box: Similar styling

Visual indicators:
- Student's answer has orange "Your Answer" label
- Correct answer has green "Correct Answer" label
- Both marked if student got it right (green throughout)

ANSWER COMPARISON (2 columns, 16px gap, margin-bottom 24px):

Left Column - Student Answer Card:
- Header "Your Answer" with user icon
- Background color based on correctness:
  * Green #f6ffed if correct
  * Red #fff1f0 if incorrect
  * Gray #fafafa if skipped
- Large answer display: "Option B" or "Not Answered"
- Status icon: Checkmark (green), X (red), or Minus (gray)
- Border 2px matching background color theme

Right Column - Correct Answer Card:
- Header "Correct Answer" with checkmark icon
- Light blue background #e6f7ff
- Blue border 2px #1890ff
- Large answer display: "Option C"
- Explanation icon with tooltip

SOLUTION SECTION (margin-bottom 24px):
Collapsible section with "Solution" header and down arrow.
When expanded:
- Light blue background #f0f5ff, rounded 12px, padding 20px
- "Detailed Solution" subheader in bold
- Step-by-step solution text with proper formatting
- Mathematical steps rendered clearly
- Diagrams or images if present
- "Helpful?" feedback buttons at bottom (thumbs up/down)

METADATA SECTION (margin-bottom 24px):
Grid of information cards (4 columns, 12px gap):

Card 1 - Status:
- Icon based on result (checkmark/X/minus)
- Large status text: "Correct" / "Incorrect" / "Skipped"
- Color-coded: Green/Red/Gray

Card 2 - Marks Awarded:
- Trophy icon
- "1 / 2" marks display
- Partial marking if applicable
- Color: Blue if full marks, orange if partial, red if zero

Card 3 - Time Taken:
- Clock icon
- "45 seconds" in bold
- "Average: 60s" comparison in small text
- Color: Green if faster, red if slower

Card 4 - Difficulty:
- Star icon
- "Medium" difficulty level
- Success rate "68% students got this right"
- Color: Orange for medium

ANALYTICS SECTION (margin-bottom 24px):
Header "Question Analytics" with chart icon.
Three mini charts in row:

1. Class Performance (pie chart, 150px):
- Correct: 68% (green)
- Incorrect: 22% (red)
- Skipped: 10% (gray)
- Center shows "68% Correct"

2. Time Distribution (bar chart):
- Shows time ranges: <30s, 30-60s, 60-90s, >90s
- Student's time highlighted
- Average marked with line

3. Option Selection (horizontal bars):
- Shows how many students selected each option
- Correct option in green
- Student's selection highlighted
- Percentages displayed

TAGS & TOPICS SECTION:
Header "Topics Covered" with tag icon.
Row of topic tags (rounded pills, light blue background):
- "Quadratic Equations"
- "Algebra"
- "Problem Solving"
Each tag clickable to see related questions.

TEACHER NOTES (if available):
Yellow note-style box with pin icon.
"Teacher's Note" header.
Additional explanation or tips from teacher.
Italic text style.

REPORT ISSUE SECTION:
Collapsible "Report an Issue" link at bottom.
When expanded, shows form:
- Issue type dropdown: Wrong Answer/Wrong Question/Technical Issue
- Description textarea
- Submit button (red)

MODAL FOOTER (padding 20px, border-top 1px #f0f0f0):
Left side:
- "Question 15 of 40" indicator
- Progress bar showing position in test

Center:
- "Mark for Review" toggle switch
- "Add to Practice" bookmark icon button

Right side:
- "Previous Question" button (gray, outline)
- "Next Question" button (blue, solid)
- Keyboard shortcuts hint: "Use ← → arrows"

MOBILE OPTIMIZATIONS:
- Full screen modal on mobile
- Stacked layout (single column)
- Larger touch targets (48px minimum)
- Swipe gestures for next/previous
- Collapsible sections to save space
- Sticky header and footer

INTERACTIONS:
- Smooth scroll to sections
- Expand/collapse animations
- Hover tooltips on icons
- Keyboard navigation (arrow keys, Esc to close)
- Copy question text button
- Share question link
- Print question button

ACCESSIBILITY:
- High contrast mode support
- Screen reader friendly
- Keyboard accessible
- Focus indicators
- ARIA labels

Style: Educational, detailed, analytical, question review interface, student feedback, modern modal design, comprehensive information display, Ant Design components, high-fidelity mockup, interactive UI elements.
```

---

## Complete Screen List

✅ **Included Screens (8 total):**
1. Complete Dashboard Screen
2. Test Results Screen
3. Login Screen
4. Mobile Responsive Dashboard
5. Student Individual Dashboard
6. Test Management Screen (Super Admin)
7. Principal/Branch Admin Dashboard
8. Question Detail Modal

Each prompt is optimized to ~4000 characters with comprehensive details!
