import { useEffect, useState } from 'react';

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    if (raw == null) return typeof initialValue === 'function' ? initialValue() : initialValue;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
