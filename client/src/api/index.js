import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
  timeout: 10000 // 10 second timeout
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For file uploads, automatically switch to multipart/form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // You can modify successful responses here
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (token expired, not logged in)
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden (no permission)
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Helper function for file uploads
API.upload = function(url, formData, config = {}) {
  return this.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default API;