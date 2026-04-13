# KREIS Assessment Management System

A comprehensive assessment management application for SuperAdmin, Institute, and Branch users.

## Features

### SuperAdmin Dashboard
- Complete overview of all tests and submissions
- Test pattern CRUD operations
- Institute test management (create, edit, delete, duplicate)
- Advanced analytics with charts and graphs
- Export test scores to Excel
- Monitor test submissions and student performance

### Institute Dashboard
- View assigned tests and manage batches
- Assign batches to tests
- View test results and submissions
- Download results in Excel format
- Track completion rates and average scores

### Branch Dashboard
- View active and completed tests
- Monitor branch-specific performance
- View top performers
- Analyze score distributions
- Track pass/fail ratios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update API URL in `.env`:
```
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

4. Start development server:
```bash
npm start
```

5. Build for production:
```bash
npm run build
```

## API Integration

The application integrates with the following APIs:

- `/auth/login` - User authentication
- `/assessment/test-pattern` - Test pattern CRUD
- `/assessment/institute-test` - Institute test management
- `/assessment/add-institute-batch-to-test` - Assign batches
- `/assessment/duplicate-test` - Duplicate tests
- `/assessment/institute-test/submit-test` - Get submissions
- `/assessment/test-analytics` - Get test analytics
- `/assessment/test-started-students` - Get started students
- `/assessment/submitted-score` - Get test scores
- `/assessment/submitted-score-excel` - Download Excel

## User Roles

- `superadmin` - Full access to all features
- `institute` - Manage institute-level tests and results
- `branch` - View branch-specific tests and performance

## Technology Stack

- React 18
- React Router 6
- Ant Design 5
- Recharts (for analytics)
- Axios (for API calls)
- Day.js (for date handling)
"# KREIS-Admin-Panel-Frontend" 
