# State Management Architecture

This document describes the state management architecture implemented in the Kreis Assessment UI application.

## Overview

The application uses React Context API for centralized state management, organized into three main contexts:

1. **FilterContext** - Manages filter selections and user permissions
2. **DashboardContext** - Manages dashboard data and operations
3. **ResultsContext** - Manages results page data and operations

## Context Structure

### 1. FilterContext (`src/context/FilterContext.js`)

Manages all filter-related state across the application.

#### State
- `selectedTest` - Currently selected test ID
- `testCategory` - Selected test category (fullLength, monthly, chapterWise)
- `filterType` - Current filter view type (all, institute, branch, batch, student)
- `filters` - Object containing:
  - `instituteId`
  - `branchId`
  - `batchId`
  - `studentId`
- `searchText` - Search query text
- `currentUser` - Current authenticated user
- `userRole` - User's role (superadmin, instituteadmin, branchadmin, etc.)

#### Actions
- `setTest(testId)` - Set selected test
- `setCategory(category)` - Set test category (resets test selection)
- `setFilterType(filterType)` - Set filter type (resets all filters)
- `setInstitute(instituteId)` - Set institute (resets dependent filters)
- `setBranch(branchId)` - Set branch (resets dependent filters)
- `setBatch(batchId)` - Set batch (resets dependent filters)
- `setStudent(studentId)` - Set student
- `setSearch(searchText)` - Set search text
- `resetFilters()` - Reset all filters except test and category

#### Helper Methods
- `areRequiredFiltersSelected()` - Check if required filters are selected based on filter type
- `getAvailableFilterTypes()` - Get filter types available for current user role
- `canSeeInstituteFilter()` - Check if user can see institute filter
- `canSeeBranchFilter()` - Check if user can see branch filter
- `canSeeBatchFilter()` - Check if user can see batch filter

#### Usage
```javascript
import { useFilters } from '../context';

const MyComponent = () => {
  const {
    selectedTest,
    filters,
    setTest,
    setBranch,
    areRequiredFiltersSelected
  } = useFilters();

  // Use state and actions
};
```

### 2. DashboardContext (`src/context/DashboardContext.js`)

Manages dashboard data fetching and processing.

#### State
- `loading` - Loading state for dashboard data
- `dashboardData` - Processed dashboard data including:
  - `stats` - Statistical metrics
  - `scoreDistribution` - Score range distribution
  - `branchPerformance` - Branch-wise performance data
  - `topPerformers` - Top performing students
  - `subjectPerformance` - Subject-wise performance (for students)
  - `questionAnalysis` - Question-wise analysis (for students)
  - `timeAnalysis` - Time analysis (for students)
- `students` - List of students for dropdown
- `error` - Error message if any

#### Actions
- `fetchDashboardData(params)` - Fetch and process dashboard data
- `fetchStudents(params)` - Fetch students for dropdown
- `clearDashboardData()` - Clear dashboard data
- `clearStudents()` - Clear students list

#### Usage
```javascript
import { useDashboard } from '../context';

const Dashboard = () => {
  const {
    loading,
    dashboardData,
    fetchDashboardData
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData({ testId: '123', filterType: 'all' });
  }, []);
};
```

### 3. ResultsContext (`src/context/ResultsContext.js`)

Manages results page data and interactions.

#### State
- `loading` - Loading state for results data
- `resultsData` - Array of result records
- `pagination` - Pagination state:
  - `current` - Current page number
  - `pageSize` - Items per page
  - `total` - Total number of records
- `expandedRowKeys` - Array of expanded row keys
- `selectedQuestion` - Currently selected question for modal
- `questionModalVisible` - Question modal visibility state
- `error` - Error message if any

#### Actions
- `fetchResultsData(params)` - Fetch results data with pagination
- `handlePaginationChange(page, pageSize)` - Handle pagination change
- `handleExpand(expanded, record)` - Handle row expansion
- `toggleRowExpansion(studentId)` - Toggle specific row expansion
- `showQuestionModal(question)` - Show question detail modal
- `hideQuestionModal()` - Hide question detail modal
- `clearResultsData()` - Clear all results data
- `exportToExcel(params)` - Export results to Excel format

#### Usage
```javascript
import { useResults } from '../context';

const Results = () => {
  const {
    resultsData,
    pagination,
    fetchResultsData,
    handlePaginationChange
  } = useResults();

  useEffect(() => {
    fetchResultsData({ testId: '123', page: 1, limit: 10 });
  }, []);
};
```

## Provider Setup

All contexts are wrapped in the main App component:

```javascript
// src/App.js
import { FilterProvider, DashboardProvider, ResultsProvider } from './context';

function App() {
  return (
    <FilterProvider>
      <DashboardProvider>
        <ResultsProvider>
          {/* App routes */}
        </ResultsProvider>
      </DashboardProvider>
    </FilterProvider>
  );
}
```

## Benefits

### 1. Centralized State Management
- All filter state is managed in one place
- Consistent state across all components
- Easy to debug and maintain

### 2. Automatic Dependency Management
- Changing institute automatically resets branch, batch, and student
- Changing branch automatically resets batch and student
- Changing batch automatically resets student
- Prevents invalid filter combinations

### 3. Role-Based Access Control
- Filter visibility based on user role
- Automatic filter population based on user profile
- Consistent permission checks across components

### 4. Separation of Concerns
- Filter logic separated from UI components
- Data fetching separated from presentation
- Business logic centralized in contexts

### 5. Reusability
- Contexts can be used in any component
- No prop drilling required
- Easy to add new features

### 6. Performance
- Reducer pattern for efficient state updates
- Memoized helper functions
- Controlled re-renders

## Component Structure

### With Context (Recommended)
```
src/
├── context/
│   ├── FilterContext.js       # Filter state management
│   ├── DashboardContext.js    # Dashboard data management
│   ├── ResultsContext.js      # Results data management
│   └── index.js               # Export all contexts
├── components/
│   └── dashboard/
│       ├── DashboardStats.js  # Reusable stats component
│       └── DashboardCharts.js # Reusable charts component
└── pages/
    └── Common/
        ├── DashboardWithContext.js  # Dashboard using contexts
        └── ResultsWithContext.js    # Results using contexts
```

## Migration Guide

To migrate existing components to use contexts:

1. Import the required context hook:
```javascript
import { useFilters, useDashboard } from '../../context';
```

2. Replace local state with context:
```javascript
// Before
const [selectedTest, setSelectedTest] = useState(null);

// After
const { selectedTest, setTest } = useFilters();
```

3. Remove prop drilling:
```javascript
// Before
<ChildComponent selectedTest={selectedTest} onTestChange={setSelectedTest} />

// After
<ChildComponent /> // Component uses useFilters() internally
```

4. Use helper methods:
```javascript
const { areRequiredFiltersSelected, canSeeBranchFilter } = useFilters();

if (!areRequiredFiltersSelected()) {
  return <Empty description="Please select required filters" />;
}
```

## Best Practices

1. **Use contexts at the component level** - Don't pass context values as props
2. **Leverage helper methods** - Use provided helpers instead of duplicating logic
3. **Handle loading states** - Always check loading state before rendering data
4. **Clear data on unmount** - Use cleanup functions to clear data when appropriate
5. **Error handling** - Check error state and display appropriate messages
6. **Memoization** - Use useMemo/useCallback for expensive operations
7. **Type safety** - Consider adding TypeScript for better type safety

## Future Enhancements

1. Add TypeScript for type safety
2. Implement Redux DevTools integration for debugging
3. Add state persistence (localStorage/sessionStorage)
4. Implement optimistic updates
5. Add request caching and deduplication
6. Implement undo/redo functionality
7. Add state migration for version updates
