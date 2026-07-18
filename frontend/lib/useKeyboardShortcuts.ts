// lib/useKeyboardShortcuts.ts: Custom hook for keyboard shortcut navigation

import { useEffect } from 'react';

interface ShortcutMap {
  [key: string]: () => void;
}

/**
 * Registers keyboard shortcuts that fire callbacks on key press.
 * Shortcuts are disabled when the user is typing in an input/textarea.
 *
 * @example
 * useKeyboardShortcuts({
 *   '1': () => navigate('dashboard'),
 *   '2': () => navigate('explorer'),
 *   'Escape': () => closeModal(),
 * });
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in form fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
