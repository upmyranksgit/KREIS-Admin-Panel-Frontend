# KREIS Assessment UI - Setup Guide

## Post-Login Flow

After successful login, users are redirected based on their role:

### Role Mapping
- `superadmin` → `/superadmin` dashboard
- `instituteadmin` → `/institute` dashboard  
- `branchadmin` → `/branch` dashboard
- `teacher` → `/institute` dashboard
- `student` → `/branch` dashboard

## User Roles & Access

### SuperAdmin
- Full system access
- Test pattern management (CRUD)
- Institute test management
- Analytics across all institutes
- Excel export functionality

### Institute Admin
- Institute-level test management
- Batch assignment to tests
- View results for institute
- Download reports

### Branch Admin / Teacher
- Branch-level test access
- View assigned tests
- Monitor student performance
- Access branch analytics

### Student
- View assigned tests
- Take tests
- View results

## API Configuration

Update `.env` file with your API Gateway URL:

```env
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

## Testing Login

Use credentials from your backend database. The login response should include:

```json
{
  "message": "Authentication successful",
  "data": {
    "token": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN",
    "user": {
      "_id": "user_id",
      "username": "username",
      "role": "superadmin|instituteadmin|branchadmin|teacher|student",
      "firstName": "First Name",
      ...
    }
  }
}
```

## Local Storage

After login, the following are stored:
- `token` - JWT access token
- `refreshToken` - Refresh token
- `user` - User object (JSON string)

## Protected Routes

All dashboard routes are protected and require authentication. Users are redirected to `/login` if:
- Not authenticated
- Accessing a route they don't have permission for

## Next Steps After Login

1. **SuperAdmin**: Navigate to Test Management to create test patterns and institute tests
2. **Institute Admin**: View tests and assign batches
3. **Branch Admin**: Monitor branch performance and view analytics
4. **Teacher**: Access assigned tests and view student submissions
5. **Student**: View and take assigned tests

## Troubleshooting

### Login successful but not redirecting
- Check browser console for errors
- Verify role value in user object
- Check ProtectedRoute component

### API calls failing after login
- Verify token is stored in localStorage
- Check API interceptor is adding Authorization header
- Verify API_BASE_URL in .env

### User data not displaying
- Check user object structure in localStorage
- Verify field names match backend response (firstName, username, etc.)
