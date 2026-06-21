import { reset } from './../../../../node_modules/yoctocolors/base.d';
import axios from 'axios';
import { getAuthToken } from './auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
if (!API_URL) {
  throw new Error(
    `NEXT_PUBLIC_API_URL is not defined in environment variables`,
  );
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'เกิดข้อผิดพลาดบางอย่าง';
    return Promise.reject(new Error(message));
  },
);
