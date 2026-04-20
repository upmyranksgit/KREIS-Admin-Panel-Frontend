# Redux State Management Setup

## Installation

First, install the required Redux packages:

```bash
npm install @reduxjs/toolkit react-redux
```

## Structure

The Redux store is organized as follows:

```
src/store/
├── index.js              # Store configuration
├── hooks.js              # Custom hooks for typed dispatch/selector
└── slices/
    ├── authSlice.js      # Authentication state
    ├── dashboardSlice.js # Dashboard data and filters
    ├── resultsSlice.js   # Results/submissions data
    └── filtersSlice.js   # Global filters (institute, branch, etc.)
```

## Usage Examples

### 1. Using Redux in Components

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardData, setFilters } from '../store/slices/dashboardSlice';

function Dashboard() {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  return (
    // Your component JSX
  );
}
```

### 2. Authentication

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, setToken, logout } from '../store/slices/authSlice';

function Login() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials);
    dispatch(setToken(response.token));
    dispatch(setUser(response.user));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
}
```

### 3. Results Page

```javascript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSubmissions, setFilters, toggleExpandedRow } from '../store/slices/resultsSlice';

function Results() {
  const dispatch = useAppDispatch();
  const { submissions, loading, pagination, expandedRowKeys } = useAppSelector(
    (state) => state.results
  );

  useEffect(() => {
    dispatch(fetchSubmissions({
      testId: selectedTest,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  }, [dispatch, selectedTest, pagination.current, pagination.pageSize]);

  const handleRowExpand = (key) => {
    dispatch(toggleExpandedRow(key));
  };
}
```

## State Structure

### Auth State
```javascript
{
  user: null | Object,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

### Dashboard State
```javascript
{
  data: null | Object,
  loading: boolean,
  error: string | null,
  filters: {
    filterType: 'all' | 'institute' | 'branch' | 'batch' | 'student',
    instituteId: string | null,
    branchId: string | null,
    batchId: string | null,
    studentId: string | null
  }
}
```

### Results State
```javascript
{
  submissions: Array,
  loading: boolean,
  error: string | null,
  pagination: {
    current: number,
    pageSize: number,
    total: number
  },
  filters: {
    testId: string | null,
    studentName: string,
    instituteId: string | null,
    branchId: string | null
  },
  expandedRowKeys: Array,
  downloadLoading: boolean,
  downloadError: string | null
}
```

### Filters State (Global)
```javascript
{
  selectedInstitute: string | null,
  selectedBranch: string | null,
  selectedBatch: string | null,
  selectedTest: string | null,
  testCategory: string | null,
  dateRange: [Date, Date] | null
}
```

## Benefits

1. **Centralized State**: All application state in one place
2. **Predictable Updates**: State changes through dispatched actions
3. **DevTools Support**: Time-travel debugging with Redux DevTools
4. **Async Handling**: Built-in support for async operations with createAsyncThunk
5. **Type Safety**: Easy to add TypeScript support
6. **Performance**: Optimized re-renders with selector memoization

## Migration from Context API

To migrate existing components:

1. Replace `useContext` with `useAppSelector`
2. Replace context provider calls with `dispatch` actions
3. Move API calls to async thunks
4. Update component logic to use Redux state

## Next Steps

1. Install packages: `npm install @reduxjs/toolkit react-redux`
2. Update components to use Redux hooks
3. Remove old Context providers
4. Test all functionality
5. Optional: Add Redux DevTools Extension for debugging
