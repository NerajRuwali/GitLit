import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value.
 * @param {any} value — the value to debounce
 * @param {number} delay — debounce delay in ms (default 400)
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
