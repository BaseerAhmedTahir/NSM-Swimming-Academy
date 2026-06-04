import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000, // 30s timeout to prevent indefinite hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('nsm_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401s (Token expiry)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401, clear the token and optionally redirect to login
    if (error.response && error.response.status === 401) {
      Cookies.remove('nsm_admin_token');
      Cookies.remove('nsm_admin_user');
      
      // Auto-redirect to login if a 401 is encountered, unless we are already on the login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
         window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
