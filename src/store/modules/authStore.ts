import { create } from 'zustand';
import { storage } from '../../lib/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
  role?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storage.get('auth', { user: null }).user,
  isAuthenticated: !!storage.get('auth', { user: null }).user,

  login: async (email) => {
    const user: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role: 'Free Plan',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    set(() => {
      storage.set('auth', { user });
      return { user, isAuthenticated: true };
    });
  },

  logout: () => {
    set(() => {
      storage.remove('auth');
      return { user: null, isAuthenticated: false };
    });
  },

  loginAsGuest: () => {
    const user: User = {
      id: crypto.randomUUID(),
      name: 'Guest User',
      email: 'guest@applyflow.app',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    set(() => {
      storage.set('auth', { user });
      return { user, isAuthenticated: true };
    });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...updates };
      storage.set('auth', { user });
      return { user };
    });
  },
}));
