import { create } from 'zustand';
import { api } from '../api/axios';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
}

function getStorage(rememberMe: boolean): Storage {
  return rememberMe ? localStorage : sessionStorage;
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

function hasToken(): boolean {
  return !!(
    localStorage.getItem('accessToken') ??
    sessionStorage.getItem('accessToken')
  );
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: hasToken(),
  isLoading: false,

  login: async (username, password, rememberMe) => {
    const { data } = await api.post('/auth/login', {
      username,
      password,
      expiresInMins: 30,
    });

    const storage = getStorage(rememberMe);
    storage.setItem('accessToken', data.accessToken);
    storage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('rememberMe', String(rememberMe));

    set({
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      },
      isAuthenticated: true,
    });
  },

  signOut: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    if (!hasToken()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
