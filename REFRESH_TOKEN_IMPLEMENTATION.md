# Refresh Token Implementation

This document describes the automatic token refresh implementation in the Kreis Assessment UI application.

## Overview

The application now implements automatic token refresh to maintain user sessions without requiring re-login when the access token expires.

## Token Lifecycle

### Access Token
- **Expiration**: 24 hours
- **Purpose**: Used for API authentication
- **Storage**: localStorage as `token`

### Refresh Token
- **Expiration**: 20 days
- **Purpose**: Used to obtain new access tokens
- **Storage**: localStorage as `refreshToken`

## Implementation Details

### 1. Login Flow (`authService.js`)

When a user logs in:
```javascript
// Tokens are stored in localStorage
localStorage.setItem('token', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

### 2. Automatic Token Refresh (`api.js`)

The axios response interceptor automatically handles token refresh:

#### When Token Expires (401 Error)
1. **Detect Expiration**: Intercepts 401 responses with token-related error messages
2. **Queue Requests**: If refresh is in progress, queues subsequent requests
3. **Call Refresh Endpoint**: Sends refresh token to `/auth/refresh-token`
4. **Update Tokens**: Stores new access and refresh tokens
5. **Retry Request**: Retries the original failed request with new token
6. **Process Queue**: Retries all queued requests with new token

#### Request Queuing
- Prevents multiple simultaneous refresh token requests
- Queues all requests that fail during token refresh
- Processes all queued requests once new token is obtained

### 3. Error Handling

#### Successful Refresh
- New tokens stored in localStorage
- Original request retried automatically
- User session continues seamlessly

#### Failed Refresh
- All tokens cleared from localStorage
- User redirected to login page
- All queued requests rejected

### 4. Manual Refresh (`authService.refreshToken()`)

Available for manual token refresh if needed:
```javascript
await authService.refreshToken();
```

## API Endpoint

### POST `/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token",
    "user": {
      "_id": "user_id",
      "username": "username",
      "role": "superadmin"
    }
  }
}
```

## Security Features

### 1. Token Validation
- Backend validates refresh token signature
- Checks token expiration
- Verifies user still exists and is active

### 2. Token Rotation
- New refresh token issued with each refresh
- Old refresh token invalidated (if backend implements rotation)

### 3. Automatic Cleanup
- Tokens cleared on refresh failure
- User redirected to login on invalid refresh token

### 4. Request Retry Protection
- `_retry` flag prevents infinite refresh loops
- Only one refresh attempt per request

## User Experience

### Seamless Session Maintenance
- User never sees token expiration errors
- No interruption to workflow
- Automatic background refresh

### Session Timeout
- After 20 days of inactivity, refresh token expires
- User must log in again
- Clear session expiration message

## Testing

### Test Scenarios

1. **Normal Operation**
   - Access token valid: Requests succeed normally
   - No refresh triggered

2. **Token Expiration**
   - Access token expires after 24 hours
   - Automatic refresh triggered on next request
   - Request succeeds with new token

3. **Multiple Concurrent Requests**
   - Multiple requests fail simultaneously
   - Only one refresh request sent
   - All requests queued and retried

4. **Refresh Token Expiration**
   - Refresh token expires after 20 days
   - Refresh fails
   - User redirected to login

5. **Invalid Refresh Token**
   - Tampered or invalid refresh token
   - Refresh fails
   - User redirected to login

### Manual Testing

1. **Test Token Expiration:**
   ```javascript
   // In browser console
   // Set token to expire soon (modify JWT payload)
   // Wait for expiration
   // Make API request
   // Verify automatic refresh
   ```

2. **Test Concurrent Requests:**
   ```javascript
   // Make multiple API calls simultaneously
   // Verify only one refresh request
   // Verify all requests succeed
   ```

3. **Test Invalid Refresh Token:**
   ```javascript
   // Set invalid refresh token
   localStorage.setItem('refreshToken', 'invalid_token');
   // Make API request
   // Verify redirect to login
   ```

## Monitoring

### Console Logs
- Token refresh attempts logged
- Refresh success/failure logged
- Queue processing logged

### Error Tracking
- Failed refresh attempts
- Invalid token errors
- Network errors during refresh

## Best Practices

### 1. Token Storage
- Use localStorage for web applications
- Consider httpOnly cookies for enhanced security (requires backend changes)

### 2. Token Expiration
- Access token: Short-lived (24 hours)
- Refresh token: Long-lived (20 days)
- Balance security and user experience

### 3. Error Handling
- Clear error messages
- Graceful degradation
- User-friendly redirects

### 4. Security
- HTTPS only in production
- Secure token transmission
- Token validation on backend

## Troubleshooting

### Issue: Infinite Refresh Loop
**Cause**: Backend returns 401 even with valid token
**Solution**: Check backend token validation logic

### Issue: User Logged Out Unexpectedly
**Cause**: Refresh token expired or invalid
**Solution**: Check refresh token expiration time

### Issue: Multiple Refresh Requests
**Cause**: Request queuing not working
**Solution**: Check `isRefreshing` flag logic

### Issue: Requests Fail After Refresh
**Cause**: New token not applied to queued requests
**Solution**: Check `processQueue` implementation

## Future Enhancements

1. **Token Refresh Before Expiration**
   - Proactively refresh token before expiration
   - Reduce failed requests

2. **Sliding Session**
   - Extend session on user activity
   - Improve user experience

3. **Multiple Device Support**
   - Track active sessions
   - Allow logout from all devices

4. **Token Revocation**
   - Backend token blacklist
   - Immediate session termination

## References

- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- OAuth 2.0 Refresh Tokens: https://tools.ietf.org/html/rfc6749#section-1.5
- Axios Interceptors: https://axios-http.com/docs/interceptors
