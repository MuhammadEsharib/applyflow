import { create } from 'zustand';
import { storage } from '../../lib/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
  role?: 'user' | 'admin' | 'ai_admin';
  createdAt: string;
  aiAdminEnabled?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  guestId: string | null;
  login: (email: string) => Promise<void>;
  loginAsAdmin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAsGuest: (guestId?: string) => void;
  createNewGuest: () => void;
  switchGuest: (guestId: string) => void;
  getGuestAccounts: () => User[];
  updateUser: (updates: Partial<User>) => void;
  toggleAIAdmin: (enabled: boolean) => void;
  isAdmin: () => boolean;
  isAIAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const authData = storage.get<{ user: User | null }>('auth', { user: null });
  const user = authData?.user || null;
  const guestId = user?.isGuest ? user.id : null;

  return {
    user,
    isAuthenticated: !!user,
    guestId,

    login: async (email) => {
      const user: User = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        isGuest: false,
        role: 'user',
        createdAt: new Date().toISOString(),
        aiAdminEnabled: false,
      };
      set(() => {
        storage.set('auth', { user });
        return { user, isAuthenticated: true, guestId: null };
      });
    },

    loginAsAdmin: async (username, password) => {
      if (username === 'admin' && password === 'admin123') {
        const user: User = {
          id: 'admin-001',
          name: 'Administrator',
          email: 'admin@applyflow.app',
          isGuest: false,
          role: 'admin',
          createdAt: new Date().toISOString(),
          aiAdminEnabled: true,
        };
        set(() => {
          storage.set('auth', { user });
          return { user, isAuthenticated: true, guestId: null };
        });
        return true;
      }
      return false;
    },

    logout: () => {
      set(() => {
        storage.remove('auth');
        return { user: null, isAuthenticated: false, guestId: null };
      });
    },

    loginAsGuest: (guestIdParam) => {
      const guestAccounts: User[] = storage.get('guestAccounts', []);
      let user: User;

      if (guestIdParam) {
        const existingGuest = guestAccounts.find((g: User) => g.id === guestIdParam);
        if (existingGuest) {
          user = existingGuest;
        } else {
          user = {
            id: crypto.randomUUID(),
            name: 'Guest User',
            email: 'guest@applyflow.app',
            isGuest: true,
            role: 'user',
            createdAt: new Date().toISOString(),
            aiAdminEnabled: false,
          };
          guestAccounts.push(user);
          storage.set('guestAccounts', guestAccounts);
        }
      } else {
        user = {
          id: crypto.randomUUID(),
          name: 'Guest User',
          email: 'guest@applyflow.app',
          isGuest: true,
          role: 'user',
          createdAt: new Date().toISOString(),
          aiAdminEnabled: false,
        };
        guestAccounts.push(user);
        storage.set('guestAccounts', guestAccounts);
      }

      set(() => {
        storage.set('auth', { user });
        return { user, isAuthenticated: true, guestId: user.id };
      });
    },

    createNewGuest: () => {
      const user: User = {
        id: crypto.randomUUID(),
        name: 'Guest User',
        email: 'guest@applyflow.app',
        isGuest: true,
        role: 'user',
        createdAt: new Date().toISOString(),
        aiAdminEnabled: false,
      };

      const guestAccounts: User[] = storage.get('guestAccounts', []);
      guestAccounts.push(user);
      storage.set('guestAccounts', guestAccounts);

      set(() => {
        storage.set('auth', { user });
        return { user, isAuthenticated: true, guestId: user.id };
      });
    },

    switchGuest: (guestIdParam) => {
      const guestAccounts: User[] = storage.get('guestAccounts', []);
      const guest = guestAccounts.find((g: User) => g.id === guestIdParam);

      if (guest) {
        set(() => {
          storage.set('auth', { user: guest });
          return { user: guest, isAuthenticated: true, guestId: guest.id };
        });
      }
    },

    getGuestAccounts: () => {
      return storage.get('guestAccounts', []);
    },

    updateUser: (updates) => {
      set((state) => {
        if (!state.user) return state;
        const user = { ...state.user, ...updates };
        storage.set('auth', { user });

        // Update in guest accounts if it's a guest
        if (user.isGuest) {
          const guestAccounts: User[] = storage.get('guestAccounts', []);
          const index = guestAccounts.findIndex((g: User) => g.id === user.id);
          if (index !== -1) {
            guestAccounts[index] = user;
            storage.set('guestAccounts', guestAccounts);
          }
        }

        return { user };
      });
    },

    toggleAIAdmin: (enabled) => {
      set((state) => {
        if (!state.user) return state;
        const user = { ...state.user, aiAdminEnabled: enabled };
        storage.set('auth', { user });
        return { user };
      });
    },

    isAdmin: () => {
      return get().user?.role === 'admin';
    },

    isAIAdmin: () => {
      return get().user?.aiAdminEnabled === true;
    },
  };
});
