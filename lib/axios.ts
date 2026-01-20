import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// In-memory variable to store the access token
let accessToken: string | null = null;

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Update the in-memory access token
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Request Interceptor: Attach the access token to the Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration and 401 errors
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/admin/login') &&
      !originalRequest.url?.includes('/admin/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        // Use a clean axios instance to avoid loops if refresh itself fails
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        // Update the original request's authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired
        setAccessToken(null);
        // Dispatch event for UI to handle logout redirect
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
