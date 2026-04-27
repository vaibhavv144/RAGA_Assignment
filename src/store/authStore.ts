import { create } from 'zustand';
import * as authService from '@/services/auth.service';
import type { AuthStatus, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  bootstrapped: boolean;
  init: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  error: null,
  bootstrapped: false,

  init: () => {
    if (get().bootstrapped) return () => undefined;
    set({ status: 'loading' });
    const unsubscribe = authService.subscribe((user) => {
      set({
        user,
        status: user ? 'authenticated' : 'unauthenticated',
        bootstrapped: true,
        error: null,
      });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ status: 'loading', error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, status: 'authenticated' });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Login failed.',
      });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, status: 'unauthenticated' });
  },

  clearError: () => set({ error: null }),
}));
