import api from '../utils/api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    console.log('Full API response:', response);
    console.log('Response data:', response.data);
    
    if (response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      console.log('Stored token and user in localStorage');
    } else {
      console.error('Token not found in response');
    }
    return response.data.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/refresh-token', 
        { refreshToken },
        { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
        }
      );
      
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        
        return response.data.data;
      } else {
        throw new Error('No token in refresh response');
      }
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  }
};
