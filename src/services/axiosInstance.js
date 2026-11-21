import axios from 'axios';

const rawUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'admin',
  },
});

axiosInstance.defaults.headers.common['X-Client'] = 'admin';

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${API_URL}/auth/refresh`,
              {},
              {
                withCredentials: true,
                headers: { 'X-Client': 'admin' },
              }
            )
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    const isClientExpectedError = error.response && (error.response.status >= 400 && error.response.status < 500);
    const message = error.response?.data?.message || error.message || 'Network error occurred';
    
    // Only log unexpected server errors (5xx/network) to console.error to avoid Next.js dev overlay on expected validation/auth errors
    if (!isClientExpectedError) {
      console.error('API Error:', message);
    }
    
    const customErr = new Error(message);
    customErr.response = error.response;
    return Promise.reject(customErr);
  }
);

export default axiosInstance;
