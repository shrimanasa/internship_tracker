// lib/debounce.ts: Debounce utility for optimizing real-time search inputs

import { useCallback, useRef } from 'react';

/**
 * Debounces a function call by the specified delay.
 * Useful for search inputs to avoid firing API calls on every keystroke.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * React hook that returns a stable debounced version of the callback.
 * The debounced function persists across re-renders.
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query);
 * }, 400);
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    ((...args: any[]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}
