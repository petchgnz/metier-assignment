import { url } from 'inspector';
import axios from 'axios';
import { clearAuthToken, getAuthToken } from './auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
if (!API_URL) {
  throw new Error(
    `NEXT_PUBLIC_API_URL is not defined in environment variables`,
  );
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes('/auth/login');
    if (err.response?.status === 401 && !isLoginRequest) {
      clearAuthToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }

    const message =
      err.response?.data?.message ?? err.message ?? 'เกิดข้อผิดพลาดบางอย่าง';
    return Promise.reject(new Error(message));
  },
);
