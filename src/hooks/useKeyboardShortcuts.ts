import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useSearchShortcuts(onSearch: () => void, onClear: () => void) {
  useKeyboardShortcuts([
    {
      key: '/',
      callback: onSearch,
      description: 'Focus search',
    },
    {
      key: 'Escape',
      callback: onClear,
      description: 'Clear search',
    },
  ]);
}

export function useNavigationShortcuts(onUp: () => void, onDown: () => void, onSelect: () => void) {
  useKeyboardShortcuts([
    {
      key: 'ArrowUp',
      callback: onUp,
      description: 'Navigate up',
    },
    {
      key: 'ArrowDown',
      callback: onDown,
      description: 'Navigate down',
    },
    {
      key: 'Enter',
      callback: onSelect,
      description: 'Select item',
    },
  ]);
}
