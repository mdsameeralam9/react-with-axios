// authApi.ts
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Create instance
export const authApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // your backend with auth
  timeout: 10000,
});

// Token helpers
function getAccessToken() {
  return localStorage.getItem('access_token');
}
function setAccessToken(t: string) {
  localStorage.setItem('access_token', t);
}
function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

// Queue for pending requests during refresh
let isRefreshing = false;
let pendingQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

function processQueue(error: AxiosError | null, token: string | null) {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(authApi.request(config));
    }
  });
  pendingQueue = [];
}

// Attach token on requests
authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s and refresh
authApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig; // cast to a mutable request config for retry
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    // Prevent loop for refresh endpoint itself
    if ((original.url ?? '').includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue request until refresh completes
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: original });
      });
    }

    isRefreshing = true;
    try {
      const rToken = getRefreshToken();
      if (!rToken) throw error;

      // perform refresh (example endpoint/payload)
      const resp = await axios.post<{ access_token: string }>(
        'https://jsonplaceholder.typicode.com/auth/refresh',
        { refresh_token: rToken },
        { timeout: 10000 }
      );
      const newToken = resp.data.access_token;
      setAccessToken(newToken);

      // update default header for subsequent requests
      authApi.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      // retry queued
      processQueue(null, newToken);

      // retry current original request with new token
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return authApi.request(original);
    } catch (refreshErr: any) {
      processQueue(refreshErr, null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);
