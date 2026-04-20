import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params) => {
    // Custom serialization to handle arrays as JSON strings
    const parts = [];
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        // Serialize array as JSON string and manually encode
        const jsonString = JSON.stringify(value);
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(jsonString)}`);
      } else if (value !== null && value !== undefined) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    return parts.join('&');
  }
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';

      // Check if it's a token expiration issue
      if (errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('expired')) {

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token, logout
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          const token = localStorage.getItem('token');
          // Call refresh token endpoint
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, 
            { refreshToken },
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );

          if (response.data?.data?.token) {
            const newToken = response.data.data.token;
            const newRefreshToken = response.data.data.refreshToken;

            // Update tokens in localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Update user data if provided
            if (response.data.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            // Update authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Process queued requests
            processQueue(null, newToken);
            isRefreshing = false;

            // Retry original request
            return api(originalRequest);
          } else {
            throw new Error('No token in refresh response');
          }
        } catch (refreshError) {
          // Refresh token failed, logout
          processQueue(refreshError, null);
          isRefreshing = false;

          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      } else {
        // Not a token issue, just reject
        return Promise.reject(error);
      }
    }

    // For 403 or other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
