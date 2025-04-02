import { useEffect, useState } from 'react';

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: SetValue<T>) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));

      window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(newValue) }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const item = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(item);
        } catch (error) {
          console.log(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;

