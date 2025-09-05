// api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// Request interceptor (attach token if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (optional normalization / logging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: log or map errors here
    return Promise.reject(error);
  }
);
