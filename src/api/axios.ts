import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('accessToken') ??
    sessionStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken =
        localStorage.getItem('refreshToken') ??
        sessionStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post('https://dummyjson.com/auth/refresh', {
            refreshToken,
            expiresInMins: 30,
          });

          const storage = localStorage.getItem('refreshToken')
            ? localStorage
            : sessionStorage;

          storage.setItem('accessToken', data.accessToken);
          storage.setItem('refreshToken', data.refreshToken);

          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          useAuthStore.getState().signOut();
        }
      } else {
        useAuthStore.getState().signOut();
      }
    }

    return Promise.reject(error);
  },
);
