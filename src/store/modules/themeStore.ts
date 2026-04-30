import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage, type StorageKey } from '../../lib/storage';

export type Theme = 'light' | 'dark' | 'system' | 'custom' | 'monolith-white';

export interface CustomThemeConfig {
  primary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
}

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  customTheme: CustomThemeConfig;
  setTheme: (theme: Theme) => void;
  setCustomTheme: (config: Partial<CustomThemeConfig>) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
  applyTheme: (resolvedTheme: 'light' | 'dark') => void;
  applyCustomTheme: () => void;
  applyMonolithWhite: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'monolith-white',
      resolvedTheme: 'light',
      customTheme: {
        primary: '#111111',
        background: '#FFFFFF',
        surface: '#EFEFEF',
        text: '#111111',
        accent: '#EFEFEF'
      },

      setTheme: (theme: Theme) => {
        set({ theme });
        if (theme === 'custom') {
          get().applyCustomTheme();
        } else if (theme === 'monolith-white') {
          get().applyMonolithWhite();
        } else {
          const resolvedTheme = theme === 'system' ? get().getSystemTheme() : theme;
          set({ resolvedTheme });
          get().applyTheme(resolvedTheme);
        }
      },

      setCustomTheme: (config: Partial<CustomThemeConfig>) => {
        const newConfig = { ...get().customTheme, ...config };
        set({ customTheme: newConfig });
        if (get().theme === 'custom') {
          get().applyCustomTheme();
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        const themes: Theme[] = ['light', 'dark', 'system', 'custom', 'monolith-white'];
        const currentIndex = themes.indexOf(current);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(nextTheme);
      },

      initializeTheme: () => {
        const { theme, getSystemTheme, applyTheme, applyCustomTheme, applyMonolithWhite } = get();
        if (theme === 'custom') {
          applyCustomTheme();
        } else if (theme === 'monolith-white') {
          applyMonolithWhite();
        } else {
          const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
          set({ resolvedTheme });
          applyTheme(resolvedTheme);
        }
      },

      getSystemTheme: () => {
        if (typeof window !== 'undefined' && window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
      },

      applyTheme: (resolvedTheme: 'light' | 'dark') => {
        const root = document.documentElement;
        if (resolvedTheme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light', 'monolith-white');
        } else {
          root.classList.add('light');
          root.classList.remove('dark', 'monolith-white');
        }
      },

      applyCustomTheme: () => {
        const { customTheme } = get();
        const root = document.documentElement;

        // Apply custom CSS variables
        root.style.setProperty('--custom-primary', customTheme.primary);
        root.style.setProperty('--custom-background', customTheme.background);
        root.style.setProperty('--custom-surface', customTheme.surface);
        root.style.setProperty('--custom-text', customTheme.text);
        root.style.setProperty('--custom-accent', customTheme.accent);

        root.classList.add('custom-theme');
        root.classList.remove('light', 'dark', 'monolith-white');
      },

      applyMonolithWhite: () => {
        const root = document.documentElement;

        // Apply Monolith White CSS variables
        root.style.setProperty('--color-monolith-white', '#FFFFFF');
        root.style.setProperty('--color-monolith-accent', '#EFEFEF');
        root.style.setProperty('--color-monolith-primary', '#111111');
        root.style.setProperty('--color-monolith-glow', 'rgba(0,0,0,0.02)');

        root.classList.add('monolith-white');
        root.classList.remove('light', 'dark', 'custom-theme');
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const storageKey = key.replace('applyflow_', '') as StorageKey;
          return storage.get(storageKey, null);
        },
        setItem: (key, value) => {
          const storageKey = key.replace('applyflow_', '') as StorageKey;
          storage.set(storageKey, value);
        },
        removeItem: (key) => {
          const storageKey = key.replace('applyflow_', '') as StorageKey;
          storage.remove(storageKey);
        },
      })),
      partialize: (state) => ({
        theme: state.theme,
        customTheme: state.customTheme
      }),
    }
  )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const themeStore = useThemeStore.getState();
  themeStore.initializeTheme();

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const { theme, getSystemTheme, applyTheme } = useThemeStore.getState();
    if (theme === 'system') {
      const resolvedTheme = getSystemTheme();
      useThemeStore.setState({ resolvedTheme });
      applyTheme(resolvedTheme);
    }
  });
}