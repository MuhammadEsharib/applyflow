import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useThemeStore, type Theme } from '../../store/modules/themeStore';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
    { value: 'custom', label: 'Custom', icon: Palette },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
          "hover:bg-black/4",
          "text-black",
          "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        )}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5"
          >
            {currentTheme && <currentTheme.icon className="w-5 h-5" />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "absolute right-0 top-12 z-50",
                "bg-white",
                "border border-border",
                "rounded-lg shadow-high-key",
                "py-2 min-w-[140px]"
              )}
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                      "hover:bg-black/4",
                      isActive
                        ? "text-black bg-black/4"
                        : "text-black/70"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{themeOption.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-black rounded-full ml-auto" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple toggle button for compact spaces
export function SimpleThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
        "hover:bg-black/4",
        "text-black",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}